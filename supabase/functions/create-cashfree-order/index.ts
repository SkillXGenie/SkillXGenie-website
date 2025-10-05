import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface OrderRequest {
  order_amount: number
  order_currency: string
  customer_details: {
    customer_id: string
    customer_name: string
    customer_email: string
    customer_phone: string
  }
  order_meta: {
    return_url: string
    notify_url: string
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    console.log('Received request to create Cashfree order');
    
    const { order_amount, order_currency, customer_details, order_meta }: OrderRequest = await req.json()
    console.log('Order request data:', { order_amount, order_currency, customer_details: { ...customer_details, customer_phone: customer_details.customer_phone ? 'PROVIDED' : 'MISSING' } });

    // Get Cashfree production credentials from environment variables
    const CASHFREE_APP_ID = Deno.env.get("CASHFREE_PRODUCTION_APPID")
    const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_PRODUCTION_SECRET_KEY")

    console.log('Environment check:', {
      hasAppId: !!CASHFREE_APP_ID,
      hasSecretKey: !!CASHFREE_SECRET_KEY,
      environment: "production"
    });

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      const errorMsg = "Cashfree production credentials not configured. Please check CASHFREE_PRODUCTION_APPID and CASHFREE_PRODUCTION_SECRET_KEY in Supabase secrets."
      console.error(errorMsg);
      throw new Error(errorMsg)
    }

    // Generate unique order ID
    const order_id = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log('Generated order ID:', order_id);

    // Cashfree API endpoint
    const cashfreeUrl = "https://api.cashfree.com/pg/orders"

    console.log('Using Cashfree URL:', cashfreeUrl);

    // Create order payload
    const orderPayload = {
      order_id,
      order_amount,
      order_currency,
      customer_details,
      order_meta
    }

    console.log('Order payload:', { ...orderPayload, customer_details: { ...customer_details, customer_phone: customer_details.customer_phone ? 'PROVIDED' : 'MISSING' } });

    // Make request to Cashfree
    console.log('Making request to Cashfree API...');
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
    
    const response = await fetch(cashfreeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01"
      },
      body: JSON.stringify(orderPayload),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId);

    console.log('Cashfree API response status:', response.status);
    const responseText = await response.text()
    console.log('Cashfree API raw response:', responseText);
    
    let cashfreeResponse;
    try {
      cashfreeResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Cashfree response:', parseError);
      throw new Error(`Invalid response from Cashfree API: ${responseText}`);
    }
    
    console.log('Cashfree API response:', cashfreeResponse);

    if (!response.ok) {
      const errorMsg = `Cashfree API error: ${cashfreeResponse.message || JSON.stringify(cashfreeResponse)}`
      console.error(errorMsg);
      throw new Error(errorMsg)
    }

    // Check for different possible response formats
    const orderToken = cashfreeResponse.order_token || cashfreeResponse.payment_session_id;
    const orderId = cashfreeResponse.order_id || cashfreeResponse.cf_order_id;
    
    if (!orderToken) {
      console.error('No order_token received from Cashfree API');
      console.error('Response:', cashfreeResponse);
      throw new Error(`No order_token received from Cashfree API. Response: ${JSON.stringify(cashfreeResponse)}`);
    }

    console.log('Order created successfully');
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          order_id: orderId,
          order_token: orderToken,
          payment_session_id: cashfreeResponse.payment_session_id
        },
        order_expiry_time: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("Cashfree API request timeout");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Request timeout - Cashfree API is not responding"
        }),
        {
          status: 408,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }
    
    console.error("Error creating Cashfree order:", error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  }
})