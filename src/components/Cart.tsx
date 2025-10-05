import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, IndianRupee } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import AuthModal from './auth/AuthModal';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  courseId: string;
  plan: 'short' | 'long';
  price: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const courses = [
  {
    id: "business-essentials",
    title: "Business Essentials",
    emoji: "💼"
  },
  {
    id: "spoken-english",
    title: "Spoken English Mastery",
    emoji: "🗣️"
  },
  {
    id: "robotics-fundamentals",
    title: "Robotics Fundamentals",
    emoji: "🤖"
  },
  {
    id: "c-programming",
    title: "C Programming",
    emoji: "💻"
  },
  {
    id: "cpp-programming",
    title: "C++ Programming",
    emoji: "💡"
  },
  {
    id: "java-programming",
    title: "Java Programming",
    emoji: "☕"
  },
  {
    id: "python-programming",
    title: "Python Programming",
    emoji: "🐍"
  }
];

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    if (isOpen) {
      const savedCart = localStorage.getItem('courseCart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        getUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const removeFromCart = (index: number) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
    localStorage.setItem('courseCart', JSON.stringify(newCart));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Handle both ₹299 and ₹2,999 formats
      const priceString = item.price.replace('₹', '').replace(',', '');
      const price = parseInt(priceString);
      return total + price;
    }, 0);
  };

  const getCourseInfo = (courseId: string) => {
    return courses.find(c => c.id === courseId);
  };

  const handleCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Navigate to checkout page
    navigate('/checkout');
    onClose();
  };

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-2" />
                  <h2 className="text-xl font-bold">Shopping Cart</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-gray-400 text-sm">Add some courses to get started!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item, index) => {
                      const courseInfo = getCourseInfo(item.courseId);
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span className="text-2xl mr-2">{courseInfo?.emoji}</span>
                                <h3 className="font-semibold text-sm">{courseInfo?.title}</h3>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  item.plan === 'short' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {item.plan === 'short' ? 'Short-Term (30 Days)' : 'Long-Term (3-4 Months)'}
                                </span>
                                <button
                                  onClick={() => removeFromCart(index)}
                                  className="text-red-500 hover:text-red-700 ml-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center font-bold text-lg">
                                  <IndianRupee className="h-4 w-4" />
                                  <span>{item.price.replace('₹', '').replace(',', '')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <div className="flex items-center text-2xl font-bold">
                        <IndianRupee className="h-6 w-6" />
                        <span>{getTotalPrice().toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleCheckout}
                      className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold mb-3"
                    >
                      Checkout
                    </button>
                    
                    <button 
                      onClick={onClose}
                      className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
    />
    </>
  );
};

export default Cart;