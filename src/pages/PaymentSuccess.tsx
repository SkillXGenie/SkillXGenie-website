import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Download, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Get payment details from URL parameters
      const orderId = searchParams.get('order_id');
      const orderToken = searchParams.get('order_token');
      const status = searchParams.get('status');
      
      if (!orderId) {
        console.error('No order ID found in URL');
        navigate('/courses');
        return;
      }

      // Check if this is a demo payment
      if (orderId.startsWith('demo_')) {
        setOrderDetails({
          order_number: orderId,
          total_amount: 29900, // Demo amount
          payment_status: 'completed',
          created_at: new Date().toISOString()
        });
      } else if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Update order status to completed
        const { data: order, error } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('order_number', orderId)
          .select()
          .single();

        if (error) {
          console.error('Error updating order:', error);
        } else {
          setOrderDetails(order);
        }
      }

      // Clear cart
      localStorage.removeItem('courseCart');
      
      setLoading(false);
    } catch (error) {
      console.error('Error verifying payment:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. Your courses are now available in your dashboard.
          </p>

          {orderDetails && (
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8 text-left">
              <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold">{orderDetails.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold">₹{(orderDetails.total_amount / 100).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-semibold text-green-600 capitalize">{orderDetails.payment_status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{new Date(orderDetails.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/courses')}
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              Browse More Courses
            </motion.button>
          </div>

          {/* What's Next */}
          <div className="mt-12 bg-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-medium mb-2">Access Your Courses</h4>
                  <p className="text-sm text-gray-600">Go to your dashboard to start learning immediately</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-medium mb-2">Download Resources</h4>
                  <p className="text-sm text-gray-600">Access downloadable materials and certificates</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-medium mb-2">Join Community</h4>
                  <p className="text-sm text-gray-600">Connect with other learners and mentors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Need help getting started?</p>
            <button
              onClick={() => navigate('/help-center')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Visit Help Center
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;