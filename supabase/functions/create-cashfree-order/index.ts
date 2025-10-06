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

/**
 * Cashfree Order Creation Edge Function
 *
 * This function creates a fresh Cashfree order token for each payment request.
 * It uses production Cashfree API endpoints and credentials.
 *
 * Environment Variables Required:
 * - CASHFREE_PRODUCTION_APPID: Your Cashfree production App ID
 * - CASHFREE_PRODUCTION_SECRET_KEY: Your Cashfree production Secret Key
 */
Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('🚀 [Cashfree] Received request to create fresh order token');

    const { order_amount, order_currency, customer_details, order_meta }: OrderRequest = await req.json();

    // Log request details (without sensitive data)
    console.log('📋 [Cashfree] Order request details:', {
      order_amount,
      order_currency,
      customer_name: customer_details.customer_name,
      customer_email: customer_details.customer_email,
      has_phone: !!customer_details.customer_phone,
      return_url: order_meta.return_url
    });

    // Get Cashfree production credentials from environment variables
    const CASHFREE_APP_ID = Deno.env.get("CASHFREE_PRODUCTION_APPID");
    const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_PRODUCTION_SECRET_KEY");

    console.log('🔐 [Cashfree] Environment check:', {
      hasAppId: !!CASHFREE_APP_ID,
      hasSecretKey: !!CASHFREE_SECRET_KEY,
      environment: "production"
    });

    // Validate credentials
    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      const errorMsg = "❌ Cashfree production credentials not configured. Please check CASHFREE_PRODUCTION_APPID and CASHFREE_PRODUCTION_SECRET_KEY in Supabase secrets.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Generate unique order ID with timestamp for uniqueness
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substr(2, 9);
    const order_id = `order_${timestamp}_${randomSuffix}`;

    console.log('🆔 [Cashfree] Generated unique order ID:', order_id);

    // Cashfree production API endpoint
    const cashfreeUrl = "https://api.cashfree.com/pg/orders";
    console.log('🌐 [Cashfree] Using production API URL:', cashfreeUrl);

    // Validate return URL is HTTPS (required for production)
    if (!order_meta.return_url.startsWith('https://')) {
      console.warn('⚠️ [Cashfree] Return URL should be HTTPS for production:', order_meta.return_url);
    }

    // Create order payload for Cashfree API
    const orderPayload = {
      order_id,
      order_amount,
      order_currency,
      customer_details: {
        customer_id: customer_details.customer_id,
        customer_name: customer_details.customer_name,
        customer_email: customer_details.customer_email,
        customer_phone: customer_details.customer_phone || "+919999999999" // Fallback phone
      },
      order_meta: {
        return_url: order_meta.return_url,
        notify_url: order_meta.notify_url
      }
    };

    console.log('📤 [Cashfree] Sending order payload to Cashfree API...');

    // Make request to Cashfree with timeout protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏰ [Cashfree] Request timeout after 25 seconds');
      controller.abort();
    }, 25000); // 25 second timeout

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

    // Get response text first
    const responseText = await response.text();
    console.log('📄 [Cashfree] Raw API response:', responseText.substring(0, 500) + '...');

    // Parse JSON response
    let cashfreeResponse;
    try {
      cashfreeResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ [Cashfree] Failed to parse API response:', parseError);
      throw new Error(`Invalid JSON response from Cashfree API: ${responseText.substring(0, 200)}`);
    }

    // Check if request was successful
    if (!response.ok) {
      const errorMsg = `❌ [Cashfree] API error (${response.status}): ${cashfreeResponse.message || JSON.stringify(cashfreeResponse)}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Extract order token/session ID from response
    // Cashfree may return different field names in different API versions
    const orderToken = cashfreeResponse.order_token || cashfreeResponse.payment_session_id;
    const orderId = cashfreeResponse.order_id || cashfreeResponse.cf_order_id;

    console.log('🔍 [Cashfree] Response analysis:', {
      has_order_token: !!cashfreeResponse.order_token,
      has_payment_session_id: !!cashfreeResponse.payment_session_id,
      has_order_id: !!orderId,
      response_keys: Object.keys(cashfreeResponse)
    });

    // Validate that we received a token
    if (!orderToken) {
      console.error('❌ [Cashfree] No order token received from API');
      console.error('📋 [Cashfree] Full response:', cashfreeResponse);
      throw new Error(`No order token received from Cashfree API. Response: ${JSON.stringify(cashfreeResponse)}`);
    }

    console.log('✅ [Cashfree] Order created successfully!');
    console.log('🎫 [Cashfree] Order token:', orderToken.substring(0, 20) + '...');

    // Return success response with order details
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          order_id: orderId,
          order_token: orderToken,
          payment_session_id: orderToken, // For compatibility
          cf_order_id: orderId
        },
        order_expiry_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
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
    // Handle timeout errors
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

    // Handle all other errors
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
