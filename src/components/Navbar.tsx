import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogIn, ShoppingCart } from 'lucide-react';
import AuthModal from './auth/AuthModal';
import Cart from './Cart';
import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    updateCartCount();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        getUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });
  }, []);

  const updateCartCount = () => {
    const savedCart = localStorage.getItem('courseCart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItemCount(cart.length);
    }
  };

  useEffect(() => {
    // Listen for storage events to update cart count
    const handleStorageChange = () => {
      updateCartCount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profile) {
        setProfile(profile);
      }
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-blue-600" : "text-gray-700 hover:text-blue-600";
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full bg-white shadow-md z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <img 
                  src="/skill-x-genie-logo.png" 
                  alt="Skill X Genie" 
                  className="h-10 w-10"
                />
                <span className="text-xl font-bold text-gray-900">Skill X Genie</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/courses" className={`${isActive('/courses')} transition-colors`}>
                Courses
              </Link>
              <Link to="/mentorship" className={`${isActive('/mentorship')} transition-colors`}>
                Mentorship
              </Link>
              <Link to="/about" className={`${isActive('/about')} transition-colors`}>
                About Us
              </Link>
              <Link to="/contact" className={`${isActive('/contact')} transition-colors`}>
                Contact
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              {user ? (
                <div 
                  className="cursor-pointer"
                  onClick={() => navigate('/dashboard')}
                >
                  <img
                    src={profile?.avatar_url || 'https://via.placeholder.com/40'}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              {user ? (
                <div 
                  className="cursor-pointer"
                  onClick={() => navigate('/dashboard')}
                >
                  <img
                    src={profile?.avatar_url || 'https://via.placeholder.com/40'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/courses"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  to="/mentorship"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mentorship
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default Navbar;