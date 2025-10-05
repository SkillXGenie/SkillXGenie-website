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
    notify_url?: string
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

    // Get Cashfree credentials from environment variables
    const CASHFREE_ENVIRONMENT = "production"
    const CASHFREE_APP_ID = Deno.env.get("CASHFREE_ENVIRONMENT_APPID")
    const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_ENVIRONMENT_SECRET_KEY")

    console.log('Environment check:', {
      hasAppId: !!CASHFREE_APP_ID,
      hasSecretKey: !!CASHFREE_SECRET_KEY,
      environment: CASHFREE_ENVIRONMENT
    });

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      const errorMsg = "Cashfree credentials not configured. Please check CASHFREE_ENVIRONMENT_APPID and CASHFREE_ENVIRONMENT_SECRET_KEY in Supabase secrets."
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
      order_meta,
      order_tags: {
        source: "skillxgenie_website"
      }
    }

    console.log('Order payload:', { ...orderPayload, customer_details: { ...customer_details, customer_phone: customer_details.customer_phone ? 'PROVIDED' : 'MISSING' } });

    // Make request to Cashfree
    console.log('Making request to Cashfree API...');
    const response = await fetch(cashfreeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01"
      },
      body: JSON.stringify(orderPayload)
    })

    console.log('Cashfree API response status:', response.status);
    const cashfreeResponse = await response.json()
    console.log('Cashfree API response:', cashfreeResponse);

    if (!response.ok) {
      const errorMsg = `Cashfree API error: ${cashfreeResponse.message || JSON.stringify(cashfreeResponse)}`
      console.error(errorMsg);
      throw new Error(errorMsg)
    }

    // Log the full response structure for debugging
    console.log('Full Cashfree response structure:', JSON.stringify(cashfreeResponse, null, 2));

    // Extract payment URL from various possible fields
    let paymentUrl = null;
    
    if (cashfreeResponse.payment_link) {
      paymentUrl = cashfreeResponse.payment_link;
      console.log('Using payment_link:', paymentUrl);
    } else if (cashfreeResponse.checkout_url) {
      paymentUrl = cashfreeResponse.checkout_url;
      console.log('Using checkout_url:', paymentUrl);
    } else if (cashfreeResponse.payment_session_id) {
      // Construct URL using session ID
      paymentUrl = `https://payments.cashfree.com/pay/${cashfreeResponse.payment_session_id}`;
      console.log('Constructed URL from session ID:', paymentUrl);
    } else if (cashfreeResponse.order_token) {
      // Alternative construction using order token
      paymentUrl = `https://payments.cashfree.com/pay/order_token/${cashfreeResponse.order_token}`;
      console.log('Constructed URL from order token:', paymentUrl);
    }

    if (!paymentUrl) {
      console.error('No valid payment URL found in response');
      console.error('Available fields:', Object.keys(cashfreeResponse));
      throw new Error('No valid payment URL received from Cashfree API');
    }

    console.log('Order created successfully');
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...cashfreeResponse,
          payment_url: paymentUrl,
          session_id: cashfreeResponse.payment_session_id
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