import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { 
  ArrowLeft, 
  IndianRupee, 
  CreditCard, 
  Shield, 
  CheckCircle,
  Lock,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface CartItem {
  courseId: string;
  plan: 'short' | 'long';
  price: string;
}

interface Course {
  id: string;
  title: string;
  emoji: string;
}

// Declare Cashfree global type
declare global {
  interface Window {
    Cashfree: any;
  }
}

const courses: Course[] = [
  { id: "business-essentials", title: "Business Essentials", emoji: "💼" },
  { id: "spoken-english", title: "Spoken English Mastery", emoji: "🗣️" },
  { id: "robotics-fundamentals", title: "Robotics Fundamentals", emoji: "🤖" },
  { id: "c-programming", title: "C Programming", emoji: "💻" },
  { id: "cpp-programming", title: "C++ Programming", emoji: "💡" },
  { id: "java-programming", title: "Java Programming", emoji: "☕" },
  { id: "python-programming", title: "Python Programming", emoji: "🐍" }
];

const CheckoutForm: React.FC<{ cartItems: CartItem[], user: any, onSuccess: () => void }> = ({ 
  cartItems, 
  user, 
  onSuccess 
}) => {
  // State management
  const [processing, setProcessing] = useState(false);
  const [cashfreeSDK, setCashfreeSDK] = useState<any>(null);
  const [sdkLoading, setSdkLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [billingDetails, setBillingDetails] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'IN'
    }
  });

  // Show error toast
  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  // Initialize Cashfree SDK on component mount
  // NOTE: SDK is disabled to avoid CORS issues with api.cashfree.com
  // We use form-based redirect as the primary payment method
  useEffect(() => {
    // Disable SDK initialization - use form redirect instead
    // initializeCashfreeSDK();
    setSdkLoading(false); // Mark as ready immediately
    console.log('💳 Using form-based payment (SDK disabled to avoid CORS)');
  }, []);

  /**
   * Load Cashfree SDK script dynamically and return a Promise
   * @returns Promise that resolves when SDK is loaded
   */
  const loadCashfreeSDKScript = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Check if Cashfree is already loaded
      if (window.Cashfree) {
        console.log('✅ Cashfree SDK already available on window');
        resolve(window.Cashfree);
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="cashfree.com"]');
      if (existingScript) {
        console.log('⏳ Cashfree script already in DOM, waiting for it to load...');
        // Wait for the existing script to load
        const checkExisting = setInterval(() => {
          if (window.Cashfree) {
            clearInterval(checkExisting);
            resolve(window.Cashfree);
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkExisting);
          if (!window.Cashfree) {
            reject(new Error('Cashfree SDK script timeout'));
          }
        }, 10000);
        return;
      }

      console.log('🔄 Loading Cashfree SDK script...');

      // Create and load the SDK script
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.type = 'text/javascript';
      script.async = true;

      script.onload = () => {
        console.log('✅ Cashfree script loaded successfully');

        // Verify that window.Cashfree is now available
        if (window.Cashfree) {
          resolve(window.Cashfree);
        } else {
          reject(new Error('Cashfree SDK loaded but window.Cashfree is undefined'));
        }
      };

      script.onerror = (error) => {
        console.error('❌ Failed to load Cashfree SDK script:', error);
        reject(new Error('Failed to load Cashfree SDK script'));
      };

      document.head.appendChild(script);
    });
  };

  /**
   * Initialize Cashfree SDK in production mode
   * SDK is optional - we have form fallback if SDK fails
   */
  const initializeCashfreeSDK = async () => {
    setSdkLoading(true);

    try {
      console.log('🔄 Attempting to initialize Cashfree SDK (optional)...');

      // Load the SDK script
      const CashfreeLib = await loadCashfreeSDKScript();

      if (!CashfreeLib) {
        console.warn('⚠️ Cashfree SDK not available - will use form fallback');
        setSdkLoading(false);
        return;
      }

      console.log('✅ Cashfree SDK loaded, initializing...');

      // Initialize Cashfree with production mode
      const cashfreeInstance = CashfreeLib({ mode: "production" });

      setCashfreeSDK(cashfreeInstance);
      setSdkLoading(false);
      console.log('✅ Cashfree SDK ready (popup mode available)');

    } catch (error: any) {
      console.warn('⚠️ Cashfree SDK initialization failed - will use form fallback:', error);
      setSdkLoading(false);
    }
  };

  /**
   * Calculate pricing with GST
   */
  const calculatePricing = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const price = parseInt(item.price.replace('₹', '').replace(',', ''));
      return total + price;
    }, 0);
    
    const gst = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + gst;
    
    return { subtotal, gst, total };
  };

  const { subtotal, gst, total } = calculatePricing();

  /**
   * Generate unique order number
   */
  const generateOrderNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${date}-${random}`;
  };

  /**
   * Save order to database
   */
  const saveOrderToDatabase = async (orderData: any) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error saving order:', error);
        throw error;
      }

      console.log('✅ Order saved to database:', data.id);
      return data;
    } catch (error) {
      console.error('❌ Database error:', error);
      throw error;
    }
  };

  /**
   * Create fresh Cashfree order token
   * This is called on every payment attempt to ensure fresh token
   */
  const createFreshOrderToken = async () => {
    try {
      console.log('🔄 Creating fresh Cashfree order token...');

      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Demo mode - simulate successful payment
        console.log('⚠️ Demo mode: Simulating payment success');
        setTimeout(() => {
          window.location.href = `${window.location.origin}/payment-success?order_id=demo_${Date.now()}&status=success`;
        }, 2000);
        return null;
      }

      // Prepare order data for backend
      const orderData = {
        order_amount: total,
        order_currency: 'INR',
        customer_details: {
          customer_id: user?.id || `guest_${Date.now()}`,
          customer_name: billingDetails.name,
          customer_email: billingDetails.email,
          customer_phone: billingDetails.phone
        },
        order_meta: {
          return_url: `${window.location.origin}/payment-success`,
          notify_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payment-webhook`
        }
      };

      console.log('📤 Sending order request to backend...');
      
      // Create order via Supabase Edge Function with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-cashfree-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(orderData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error:', errorText);
        throw new Error(`Backend error: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Fresh order token received:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create payment order');
      }

      return result.data;

    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection and try again');
      }
      console.error('❌ Error creating order token:', error);
      throw error;
    }
  };

  /**
   * Submit form to Cashfree hosted checkout page
   */
  const submitToHostedCheckout = (sessionId: string, orderId: string) => {
    console.log('📝 Creating form for hosted checkout...');

    // Create a form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.cashfree.com/checkout/post/submit';

    // Add order token field
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'orderToken';
    tokenInput.value = sessionId;
    form.appendChild(tokenInput);

    // Add return URL
    const returnUrlInput = document.createElement('input');
    returnUrlInput.type = 'hidden';
    returnUrlInput.name = 'returnUrl';
    returnUrlInput.value = `${window.location.origin}/payment-success?order_id=${orderId}`;
    form.appendChild(returnUrlInput);

    // Append to body and submit
    document.body.appendChild(form);
    console.log('📤 Submitting form to Cashfree hosted checkout');
    form.submit();
  };

  /**
   * Open Cashfree payment with form-based redirect
   * SDK is optional and will fallback to form immediately if it fails
   */
  const openCashfreePayment = async (cashfreeOrder: any) => {
    const sessionId = cashfreeOrder.payment_session_id || cashfreeOrder.order_token;
    const orderId = cashfreeOrder.order_id;

    console.log('\n=== CASHFREE PAYMENT INITIATION ===');
    console.log('📋 Order ID:', orderId);
    console.log('📋 Session ID:', sessionId);
    console.log('📋 SDK Available:', !!cashfreeSDK);

    // Validate session ID
    if (!sessionId) {
      console.error('❌ No payment session ID received');
      throw new Error('No payment session ID received from backend');
    }

    // IMPORTANT: To avoid CORS issues, we primarily use form-based redirect
    // The SDK might try to call api.cashfree.com which causes CORS errors

    let sdkAttempted = false;

    // Only try SDK if available (with quick timeout to avoid delays)
    if (cashfreeSDK && typeof cashfreeSDK.checkout === 'function') {
      console.log('💳 SDK available - attempting popup (2s timeout)...');

      try {
        sdkAttempted = true;

        const sdkPromise = new Promise<void>((resolve, reject) => {
          try {
            cashfreeSDK.checkout({
              paymentSessionId: sessionId,
              returnUrl: `${window.location.origin}/payment-success?order_id=${orderId}`,
              onSuccess: (data: any) => {
                console.log('✅ Payment Success:', data);
                setProcessing(false);
                window.location.href = `${window.location.origin}/payment-success?order_id=${orderId}&status=success`;
                resolve();
              },
              onFailure: (data: any) => {
                console.error('❌ Payment Failed:', data);
                setProcessing(false);
                showError(data?.message || 'Payment failed');
                reject(new Error('Payment failed'));
              },
              onClose: () => {
                console.log('🔒 Popup closed by user');
                setProcessing(false);
                reject(new Error('Popup closed'));
              }
            });
          } catch (err) {
            reject(err);
          }
        });

        // 2 second timeout for SDK popup
        const timeoutPromise = new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('SDK timeout')), 2000)
        );

        await Promise.race([sdkPromise, timeoutPromise]);
        console.log('✅ SDK popup opened');
        return; // Success, exit here

      } catch (sdkError: any) {
        console.warn('⚠️ SDK failed:', sdkError.message);
        // Continue to form fallback
      }
    }

    // Form-based redirect (primary/fallback method)
    if (!sdkAttempted) {
      console.log('📝 Using form-based redirect (avoiding CORS)');
    } else {
      console.log('📝 Falling back to form-based redirect');
    }

    submitToHostedCheckout(sessionId, orderId);
  };

  /**
   * Handle payment process
   * This is the main payment handler called directly from user click
   */
  const handlePayment = async () => {
    // Prevent multiple rapid clicks
    if (processing) {
      console.log('⚠️ Payment already in progress, ignoring click');
      return;
    }

    // Validate form data
    if (!billingDetails.name || !billingDetails.email || !billingDetails.phone) {
      showError('Please fill in all required fields');
      return;
    }

    if (!billingDetails.address.line1 || !billingDetails.address.city || !billingDetails.address.state) {
      showError('Please fill in all address fields');
      return;
    }

    setProcessing(true);
    console.log('🚀 Starting payment process...');

    try {
      // Step 1: Save order to database first
      const orderNumber = generateOrderNumber();
      const orderData = {
        user_id: user?.id || null,
        order_number: orderNumber,
        customer_name: billingDetails.name,
        customer_email: billingDetails.email,
        customer_phone: billingDetails.phone,
        billing_address: billingDetails.address,
        items: cartItems.map(item => ({
          courseId: item.courseId,
          plan: item.plan,
          price: item.price,
          courseName: courses.find(c => c.id === item.courseId)?.title || 'Unknown Course'
        })),
        subtotal: subtotal * 100, // Convert to paise
        gst_amount: gst * 100, // Convert to paise
        total_amount: total * 100, // Convert to paise
        payment_status: 'pending',
        created_at: new Date().toISOString()
      };

      // Create user profile if needed
      if (user?.id && import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (!existingProfile) {
          await supabase
            .from('profiles')
            .insert({
              id: user.id,
              name: billingDetails.name,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
        }
      }

      let savedOrder;
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        savedOrder = await saveOrderToDatabase(orderData);
      }

      // Step 2: Create fresh order token
      const cashfreeOrder = await createFreshOrderToken();
      
      if (!cashfreeOrder) {
        // Demo mode already handled
        return;
      }

      // Step 3: Update order with Cashfree details
      if (savedOrder && import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        await supabase
          .from('orders')
          .update({ 
            payment_status: 'pending',
            payment_intent_id: cashfreeOrder.order_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', savedOrder.id);
      }

      // Step 4: Clear cart before opening payment
      localStorage.removeItem('courseCart');

      // Step 5: Open Cashfree payment - popup with redirect fallback
      await openCashfreePayment(cashfreeOrder);

    } catch (error) {
      console.error('❌ Payment error:', error);
      showError(`Payment failed: ${error.message || 'Unknown error occurred'}. Please try again.`);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-6">
      {/* Billing Details */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Billing Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={billingDetails.name}
              onChange={(e) => setBillingDetails({...billingDetails, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={billingDetails.email}
              onChange={(e) => setBillingDetails({...billingDetails, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={billingDetails.phone}
              onChange={(e) => setBillingDetails({...billingDetails, phone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 1 *
            </label>
            <input
              type="text"
              required
              value={billingDetails.address.line1}
              onChange={(e) => setBillingDetails({
                ...billingDetails, 
                address: {...billingDetails.address, line1: e.target.value}
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              required
              value={billingDetails.address.city}
              onChange={(e) => setBillingDetails({
                ...billingDetails, 
                address: {...billingDetails.address, city: e.target.value}
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              required
              value={billingDetails.address.state}
              onChange={(e) => setBillingDetails({
                ...billingDetails, 
                address: {...billingDetails.address, state: e.target.value}
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Methods Available
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
            <div className="text-2xl mb-2">💳</div>
            <div className="font-medium text-sm">Credit/Debit Card</div>
            <div className="text-xs text-gray-500">Visa, Mastercard, RuPay</div>
          </div>
          <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
            <div className="text-2xl mb-2">📱</div>
            <div className="font-medium text-sm">UPI</div>
            <div className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</div>
          </div>
          <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
            <div className="text-2xl mb-2">🏦</div>
            <div className="font-medium text-sm">Net Banking</div>
            <div className="text-xs text-gray-500">All major banks</div>
          </div>
          <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
            <div className="text-2xl mb-2">👛</div>
            <div className="font-medium text-sm">Wallet</div>
            <div className="text-xs text-gray-500">Paytm, Mobikwik, etc.</div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>How Payment Works:</strong>
          </p>
          <ol className="text-sm text-blue-800 mt-2 space-y-1">
            <li>1. Click "Proceed to Payment" below</li>
            <li>2. You'll be redirected to Cashfree's secure payment page</li>
            <li>3. Choose your payment method (Card/UPI/NetBanking/Wallet)</li>
            <li>4. Complete the payment securely</li>
            <li>5. You'll be redirected back to our success page</li>
          </ol>
          <p className="text-sm text-blue-800 mt-2">
            <strong>Note:</strong> All payment details are entered on Cashfree's secure platform, not on our site.
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        
        <div className="space-y-3 mb-4">
          {cartItems.map((item, index) => {
            const course = courses.find(c => c.id === item.courseId);
            return (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{course?.emoji}</span>
                  <div>
                    <h4 className="font-medium">{course?.title}</h4>
                    <p className="text-sm text-gray-600">
                      {item.plan === 'short' ? 'Short-Term (30 Days)' : 'Long-Term (3-4 Months)'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center font-semibold">
                  <IndianRupee className="h-4 w-4" />
                  <span>{item.price.replace('₹', '').replace(',', '')}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="space-y-2 border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <div className="flex items-center">
              <IndianRupee className="h-4 w-4" />
              <span>{subtotal.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span>GST (18%):</span>
            <div className="flex items-center">
              <IndianRupee className="h-4 w-4" />
              <span>{gst.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
            <span>Total:</span>
            <div className="flex items-center">
              <IndianRupee className="h-5 w-5" />
              <span>{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={processing || sdkLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : sdkLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Loading Payment System...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Lock className="h-5 w-5 mr-2" />
            Proceed to Payment ₹{total.toLocaleString()}
          </div>
        )}
      </button>
      
      <div className="text-center text-sm text-gray-600">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-4 w-4 mr-1" />
          <span>Secure Payment Processing</span>
        </div>
        <p>Your payment is protected by industry-standard encryption</p>
        <p className="text-xs mt-1 text-blue-600">
          ✅ Production Payment Gateway - Real transactions
        </p>
      </div>

      {/* Error Toast */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-md z-50"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-4 flex-shrink-0 inline-flex text-white hover:text-gray-200"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </form>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
    loadCartItems();
  }, []);

  const getUser = async () => {
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase not configured, redirecting to courses');
        navigate('/courses');
        return;
      }

      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error && error.message !== 'Authentication not configured') {
        console.error('Error getting user:', error);
        navigate('/courses');
        return;
      }
      
      if (!user) {
        navigate('/courses');
        return;
      }
      
      setUser(user);
      setLoading(false);
    } catch (error) {
      if (error.message !== 'Authentication not configured') {
        console.error('Error getting user:', error);
      }
      navigate('/courses');
    }
  };

  const loadCartItems = () => {
    const savedCart = localStorage.getItem('courseCart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      if (cart.length === 0) {
        navigate('/courses');
        return;
      }
      setCartItems(cart);
    } else {
      navigate('/courses');
    }
  };

  const handlePaymentSuccess = () => {
    navigate('/dashboard', { 
      state: { 
        message: 'Payment successful! Your courses have been added to your account.' 
      }
    });
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
            <span>Secure Checkout</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="flex items-center text-blue-600">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                1
              </div>
              <span className="ml-2 font-medium">Cart</span>
            </div>
            <div className="flex-1 h-1 bg-blue-600 mx-4"></div>
            <div className="flex items-center text-blue-600">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                2
              </div>
              <span className="ml-2 font-medium">Checkout</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
            <div className="flex items-center text-gray-400">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold">
                3
              </div>
              <span className="ml-2">Complete</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <CheckoutForm 
          cartItems={cartItems} 
          user={user} 
          onSuccess={handlePaymentSuccess}
        />

        {/* Trust Indicators */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Shield className="h-8 w-8 text-green-500 mb-2" />
            <span className="text-sm font-medium">Secure Payment</span>
            <span className="text-xs text-gray-600">SSL Encrypted</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
            <span className="text-sm font-medium">Money Back Guarantee</span>
            <span className="text-xs text-gray-600">30 Days</span>
          </div>
          <div className="flex flex-col items-center">
            <CreditCard className="h-8 w-8 text-green-500 mb-2" />
            <span className="text-sm font-medium">All Payment Methods</span>
            <span className="text-xs text-gray-600">Cards, UPI, Wallets</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;