import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface VerifyPaymentRequest {
  order_id: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('🔍 [Verify Payment] Received payment verification request');

    const { order_id }: VerifyPaymentRequest = await req.json();

    if (!order_id) {
      throw new Error('Order ID is required');
    }

    console.log('📋 [Verify Payment] Order ID:', order_id);

    const CASHFREE_APP_ID = Deno.env.get("CASHFREE_PRODUCTION_APPID");
    const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_PRODUCTION_SECRET_KEY");

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      throw new Error('Cashfree credentials not configured');
    }

    // Verify payment status with Cashfree API
    const cashfreeUrl = `https://api.cashfree.com/pg/orders/${order_id}`;
    console.log('🌐 [Verify Payment] Calling Cashfree API:', cashfreeUrl);

    const response = await fetch(cashfreeUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': '2022-09-01'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [Verify Payment] Cashfree API error:', errorText);
      throw new Error(`Cashfree API error: ${response.status}`);
    }

    const paymentData = await response.json();
    console.log('✅ [Verify Payment] Payment status:', paymentData.order_status);

    // Check if payment is successful
    const isSuccess = paymentData.order_status === 'PAID';

    return new Response(
      JSON.stringify({
        success: isSuccess,
        data: {
          order_id: paymentData.order_id,
          payment_status: isSuccess ? 'SUCCESS' : 'FAILED',
          order_status: paymentData.order_status,
          order_amount: paymentData.order_amount,
          order_currency: paymentData.order_currency
        },
        message: isSuccess ? 'Payment verified successfully' : 'Payment not completed'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('❌ [Verify Payment] Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to verify payment'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
