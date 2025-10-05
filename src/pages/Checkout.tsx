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

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
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

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Visa, Mastercard, RuPay'
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: '📱',
    description: 'Google Pay, PhonePe, Paytm'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: '🏦',
    description: 'All major banks'
  },
  {
    id: 'wallet',
    name: 'Wallet',
    icon: '👛',
    description: 'Paytm, Mobikwik, etc.'
  }
];
// Declare Cashfree global
declare global {
  interface Window {
    Cashfree: any;
  }
}

const CheckoutForm: React.FC<{ cartItems: CartItem[], user: any, onSuccess: () => void }> = ({ 
  cartItems, 
  user, 
  onSuccess 
}) => {
  const [processing, setProcessing] = useState(false);
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

  const generateOrderNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${date}-${random}`;
  };

  const saveOrderToDatabase = async (orderData: any) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Error saving order:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  };

  const createCashfreeOrder = async () => {
    try {
      console.log('Creating Cashfree order...');

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
          notify_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payment-webhook`,
          payment_methods: "cc,dc,ppc,ccc,emi,paypal,upi,nb,app,paylater"
        }
      };

      console.log('Calling Supabase Edge Function...');
      console.log('Edge Function URL:', `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-cashfree-order`);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-cashfree-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(orderData)
      });

      console.log('Edge Function Response Status:', response.status);
      console.log('Edge Function Response Headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge function error:', errorText);
        console.error('Response status:', response.status);
        console.error('Response statusText:', response.statusText);
        throw new Error(`Failed to create payment order: ${errorText}`);
      }

      const result = await response.json();
      console.log('Cashfree order created:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create payment order');
      }

      return result.data;

    } catch (error) {
      console.error('Error creating Cashfree order:', error);
      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!billingDetails.name || !billingDetails.email || !billingDetails.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (!billingDetails.address.line1 || !billingDetails.address.city || !billingDetails.address.state) {
      alert('Please fill in all address fields');
      return;
    }

    setProcessing(true);

    try {
      console.log('Starting payment process...');

      // First, save order to database
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

      // Ensure user profile exists before creating order
      if (user?.id) {
        console.log('Checking if profile exists for user:', user.id);
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        console.log('Existing profile:', existingProfile);
        if (!existingProfile) {
          console.log('Creating new profile for user:', user.id);
          // Create profile if it doesn't exist
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              name: billingDetails.name,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
            throw new Error(`Failed to create user profile: ${profileError.message}`);
          }
          
          console.log('Profile created successfully');
        }
      }

      console.log('Saving order to database...');
      const savedOrder = await saveOrderToDatabase(orderData);
      console.log('Order saved:', savedOrder);

      // Create Cashfree order
      console.log('Creating Cashfree payment order...');
      const cashfreeOrder = await createCashfreeOrder();
      console.log('Cashfree order created:', cashfreeOrder);

      // Update order with Cashfree order details
      await supabase
        .from('orders')
        .update({ 
          payment_status: 'pending',
          payment_intent_id: cashfreeOrder.order_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', savedOrder.id);

      console.log('Order updated with Cashfree details');

      // Clear cart
      localStorage.removeItem('courseCart');

      // Redirect to Cashfree payment page
      let paymentUrl;
      
      // Only use the payment URL provided by our Edge Function
      if (cashfreeOrder.payment_url) {
        paymentUrl = cashfreeOrder.payment_url;
      } else {
        console.error('Cashfree response:', cashfreeOrder);
        throw new Error('No valid payment URL received from payment service');
      }
      
      console.log('Redirecting to payment URL:', paymentUrl);
      
      // Redirect immediately
      window.location.href = paymentUrl;

    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.message}. Please try again.`);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        disabled={processing}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Creating Payment Order...
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
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const { data: { user }, error } = await supabase.auth.getUser();
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Supabase auth error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText
        });
        navigate('/courses');
        return;
      }
      if (!user) {
        console.log('No user found, redirecting to courses');
        navigate('/courses');
        return;
      }
      setUser(user);
      setLoading(false);
    } catch (error) {
      console.error('Network error getting user:', error);
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      console.error('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.error('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      // Check if it's a network error
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error('Network connectivity issue detected');
        alert('Unable to connect to the server. Please check your internet connection and try again.');
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