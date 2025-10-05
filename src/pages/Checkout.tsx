import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
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

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');

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
  const stripe = useStripe();
  const elements = useElements();
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setProcessing(false);
      return;
    }

    try {
      // First, save order to database
      const orderNumber = generateOrderNumber();
      const orderData = {
        user_id: user.id,
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
        payment_status: 'pending'
      };

      const savedOrder = await saveOrderToDatabase(orderData);
      console.log('Order saved:', savedOrder);

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      if (paymentMethodError) {
        console.error('Payment method error:', paymentMethodError);
        alert('Payment failed: ' + paymentMethodError.message);
        setProcessing(false);
        return;
      }

      // In a real implementation, you would:
      // 1. Send payment details to your backend
      // 2. Create a payment intent on your server
      // 3. Confirm the payment
      // 4. Update order status to 'completed'
      
      // For demo purposes, we'll simulate a successful payment
      setTimeout(() => {
        // Update order status to completed
        try {
          await supabase
            .from('orders')
            .update({ 
              payment_status: 'completed',
              payment_intent_id: 'demo_payment_' + Date.now()
            })
            .eq('id', savedOrder.id);
          
          alert(`Payment successful! Order #${orderNumber} (Demo mode)`);
        } catch (error) {
          console.error('Error updating order status:', error);
          alert('Payment successful but failed to update order status');
        }
        
        // Clear cart
        localStorage.removeItem('courseCart');
        
        // Call success callback
        onSuccess();
        
        setProcessing(false);
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      
      // Update order status to failed if order was created
      try {
        const orderNumber = generateOrderNumber();
        await supabase
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('order_number', orderNumber);
      } catch (dbError) {
        console.error('Error updating failed order status:', dbError);
      }
      
      alert('Payment failed. Please try again.');
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

      {/* Payment Details */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Information
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details *
          </label>
          <div className="border border-gray-300 rounded-lg p-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Shield className="h-4 w-4 mr-2" />
          <span>Your payment information is secure and encrypted</span>
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
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Lock className="h-5 w-5 mr-2" />
            Pay ₹{total.toLocaleString()}
          </div>
        )}
      </button>
      
      <div className="text-center text-sm text-gray-600">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-4 w-4 mr-1" />
          <span>Secured by Stripe</span>
        </div>
        <p>Your payment is protected by industry-standard encryption</p>
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/courses');
      return;
    }
    setUser(user);
    setLoading(false);
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
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            cartItems={cartItems} 
            user={user} 
            onSuccess={handlePaymentSuccess}
          />
        </Elements>

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
            <span className="text-sm font-medium">All Cards Accepted</span>
            <span className="text-xs text-gray-600">Visa, Mastercard, etc.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;