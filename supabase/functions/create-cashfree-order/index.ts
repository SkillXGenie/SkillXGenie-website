import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OrderRequest {
  order_amount: number;
  order_currency: string;
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
  order_meta: {
    return_url: string;
    notify_url: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('🚀 [Cashfree] Received request to create fresh order token');

    const { order_amount, order_currency, customer_details, order_meta }: OrderRequest = await req.json();

    console.log('📋 [Cashfree] Order request details:', {
      order_amount,
      order_currency,
      customer_name: customer_details.customer_name,
      customer_email: customer_details.customer_email,
      has_phone: !!customer_details.customer_phone,
      return_url: order_meta.return_url
    });

    const CASHFREE_APP_ID = Deno.env.get("CASHFREE_PRODUCTION_APPID");
    const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_PRODUCTION_SECRET_KEY");

    console.log('🔐 [Cashfree] Environment check:', {
      hasAppId: !!CASHFREE_APP_ID,
      hasSecretKey: !!CASHFREE_SECRET_KEY,
      environment: "production"
    });

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      const errorMsg = "❌ Cashfree production credentials not configured. Please check CASHFREE_PRODUCTION_APPID and CASHFREE_PRODUCTION_SECRET_KEY in Supabase secrets.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substr(2, 9);
    const order_id = `order_${timestamp}_${randomSuffix}`;

    console.log('🆔 [Cashfree] Generated unique order ID:', order_id);

    const cashfreeUrl = "https://api.cashfree.com/pg/orders";
    console.log('🌐 [Cashfree] Using production API URL:', cashfreeUrl);

    if (!order_meta.return_url.startsWith('https://')) {
      console.warn('⚠️ [Cashfree] Return URL should be HTTPS for production:', order_meta.return_url);
    }

    const orderPayload = {
      order_id,
      order_amount,
      order_currency,
      customer_details: {
        customer_id: customer_details.customer_id,
        customer_name: customer_details.customer_name,
        customer_email: customer_details.customer_email,
        customer_phone: customer_details.customer_phone || "+919999999999"
      },
      order_meta: {
        return_url: order_meta.return_url,
        notify_url: order_meta.notify_url
      }
    };

    console.log('📤 [Cashfree] Sending order payload to Cashfree API...');
    console.log('📋 [Cashfree] Full payload:', JSON.stringify(orderPayload, null, 2));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏰ [Cashfree] Request timeout after 25 seconds');
      controller.abort();
    }, 25000);

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
    });

    clearTimeout(timeoutId);

    console.log('📨 [Cashfree] API response status:', response.status);

    const responseText = await response.text();
    console.log('📄 [Cashfree] Raw API response:', responseText);

    let cashfreeResponse;
    try {
      cashfreeResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ [Cashfree] Failed to parse API response:', parseError);
      throw new Error(`Invalid JSON response from Cashfree API: ${responseText.substring(0, 200)}`);
    }

    if (!response.ok) {
      const errorMsg = `Cashfree API error (${response.status}): ${cashfreeResponse.message || JSON.stringify(cashfreeResponse)}`;
      console.error('❌ [Cashfree] ' + errorMsg);
      console.error('📋 [Cashfree] Full error response:', JSON.stringify(cashfreeResponse, null, 2));
      throw new Error(errorMsg);
    }

    const orderToken = cashfreeResponse.order_token || cashfreeResponse.payment_session_id;
    const orderId = cashfreeResponse.order_id || cashfreeResponse.cf_order_id;

    console.log('🔍 [Cashfree] Response analysis:', {
      has_order_token: !!cashfreeResponse.order_token,
      has_payment_session_id: !!cashfreeResponse.payment_session_id,
      has_order_id: !!orderId,
      response_keys: Object.keys(cashfreeResponse)
    });

    if (!orderToken) {
      console.error('❌ [Cashfree] No order token received from API');
      console.error('📋 [Cashfree] Full response:', cashfreeResponse);
      throw new Error(`No order token received from Cashfree API. Response: ${JSON.stringify(cashfreeResponse)}`);
    }

    console.log('✅ [Cashfree] Order created successfully!');
    console.log('🎫 [Cashfree] Order token:', orderToken.substring(0, 20) + '...');

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          order_id: orderId,
          order_token: orderToken,
          payment_session_id: orderToken,
          cf_order_id: orderId
        },
        order_expiry_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        message: "Fresh order token created successfully"
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("⏰ [Cashfree] Request timeout - API not responding");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Request timeout - Cashfree API is not responding. Please try again."
        }),
        {
          status: 408,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.error("❌ [Cashfree] Error creating order:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred while creating payment order"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
