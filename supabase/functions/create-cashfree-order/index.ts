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

    // Validate that we received an order_token
    if (!cashfreeResponse.order_token) {
      console.error('No order_token received from Cashfree API');
      console.error('Response:', cashfreeResponse);
      throw new Error('No order_token received from Cashfree API');
    }

    console.log('Order created successfully');
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          order_id: cashfreeResponse.order_id,
          order_token: cashfreeResponse.order_token,
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