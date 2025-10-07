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
  const [verificationFailed, setVerificationFailed] = useState(false);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Get payment details from URL parameters
      const orderId = searchParams.get('order_id');
      const orderToken = searchParams.get('order_token');

      if (!orderId) {
        console.error('No order ID found in URL');
        navigate('/courses');
        return;
      }

      console.log('Verifying payment for order:', orderId);

      // Check if this is a demo payment
      if (orderId.startsWith('demo_')) {
        setOrderDetails({
          order_number: orderId,
          total_amount: 29900,
          payment_status: 'completed',
          created_at: new Date().toISOString()
        });
        setLoading(false);
        return;
      }

      // Verify payment status with backend
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        try {
          // Call backend to verify payment with Cashfree
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
              },
              body: JSON.stringify({ order_id: orderId })
            }
          );

          if (!response.ok) {
            throw new Error('Payment verification failed');
          }

          const result = await response.json();
          console.log('Payment verification result:', result);

          // Check if payment was actually successful
          if (result.success && result.data.payment_status === 'SUCCESS') {
            // Update order in database
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
              // Clear cart only on successful payment
              localStorage.removeItem('courseCart');
            }
          } else {
            // Payment was not successful
            console.error('Payment not successful:', result);
            setVerificationFailed(true);
            setLoading(false);
            return;
          }
        } catch (verifyError) {
          console.error('Error verifying payment:', verifyError);
          // Don't show success if verification fails
          setVerificationFailed(true);
          setLoading(false);
          return;
        }
      } else {
        // No Supabase configured
        setVerificationFailed(true);
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error in payment verification:', error);
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

  if (verificationFailed) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Not Completed</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your payment could not be verified. If you believe this is an error or if any amount was deducted, please contact our support team.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/checkout')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Try Again
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact')}
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Contact Support
              </motion.button>
            </div>
          </motion.div>
        </div>
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
            Thank you for your enrollment! You will be contacted soon by our team.
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
                  <h4 className="font-medium mb-2">We'll Contact You Soon</h4>
                  <p className="text-sm text-gray-600">Our team will reach out to you within 24 hours with course details</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-medium mb-2">Live Classes Will Start</h4>
                  <p className="text-sm text-gray-600">You'll receive the schedule and joining links for live classes</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-medium mb-2">Course Materials</h4>
                  <p className="text-sm text-gray-600">Access to learning materials and resources will be provided</p>
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