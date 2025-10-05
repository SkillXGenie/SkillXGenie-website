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
    const { order_amount, order_currency, customer_details, order_meta }: OrderRequest = await req.json()

    // Get Cashfree credentials from Supabase secrets
    const CASHFREE_APP_ID = Deno.env.get("CASHFREE_ENVIRONMENT_APPID")
    const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_ENVIRONMENT_SECRET_KEY")
    const CASHFREE_ENVIRONMENT = "sandbox" // Using sandbox for testing

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      throw new Error("Cashfree credentials not configured. Please check CASHFREE_ENVIRONMENT_APPID and CASHFREE_ENVIRONMENT_SECRET_KEY in Supabase secrets.")
    }

    // Generate unique order ID
    const order_id = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Cashfree API endpoint
    const cashfreeUrl = CASHFREE_ENVIRONMENT === "production" 
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders"

    // Create order payload
    const orderPayload = {
      order_id,
      order_amount,
      order_currency,
      customer_details,
      order_meta
    }

    // Make request to Cashfree
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

    const cashfreeResponse = await response.json()

    if (!response.ok) {
      throw new Error(`Cashfree API error: ${cashfreeResponse.message || 'Unknown error'}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: cashfreeResponse
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