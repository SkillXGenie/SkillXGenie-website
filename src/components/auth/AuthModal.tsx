import React, { Fragment, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const verificationSchema = z.object({
  email: z.string().email('Invalid email address'),
  token: z.string().min(6, 'Verification code must be 6 digits'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type VerificationFormData = z.infer<typeof verificationSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const verificationForm = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      email: registrationEmail,
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    const { email, password } = data;

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          alert('Please verify your email before logging in. Check your inbox for the verification link.');
        } else {
          alert('Login failed: ' + error.message);
        }
      } else if (authData.user) {
        alert('Logged in successfully!');
        onClose();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    const { name, email, password } = data;

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Registration error:', error.message);
        if (error.message.includes('User already registered')) {
          alert('This email is already registered. Please try logging in instead.');
        } else {
          alert('Registration failed: ' + error.message);
        }
      } else {
        alert('Registration successful! Please check your email to verify your account before logging in.');
        setIsLogin(true);
        registerForm.reset();
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (data: VerificationFormData) => {
    setLoading(true);
    const { email, token } = data;

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        alert('Verification failed: ' + error.message);
      } else {
        alert('Email verified successfully! You can now log in.');
        setShowVerification(false);
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('An unexpected error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        alert('Reset failed: ' + error.message);
      } else {
        alert('Password reset link sent! Check your email.');
        setShowForgotPassword(false);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!registrationEmail) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'email',
        email: registrationEmail,
      });

      if (error) {
        alert('Failed to resend verification: ' + error.message);
      } else {
        alert('Verification code resent! Check your email.');
      }
    } catch (error) {
      console.error('Resend error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-xl font-semibold leading-6 text-gray-900">
                    {showForgotPassword ? 'Reset Password' : 
                     showVerification ? 'Verify Email' :
                     isLogin ? 'Login' : 'Register'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {showVerification ? (
                  <form onSubmit={verificationForm.handleSubmit(handleVerification)}>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800 text-sm">
                          We've sent a 6-digit verification code to your email address. Please enter it below.
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          {...verificationForm.register('email')}
                          value={registrationEmail}
                          readOnly
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          {...verificationForm.register('token')}
                          placeholder="Enter 6-digit code"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {verificationForm.formState.errors.token && (
                          <p className="mt-1 text-sm text-red-600">
                            {verificationForm.formState.errors.token.message}
                          </p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Verifying...' : 'Verify Email'}
                      </button>
                      <div className="flex justify-between text-sm">
                        <button
                          type="button"
                          onClick={resendVerification}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                        >
                          Resend Code
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowVerification(false);
                            setIsLogin(true);
                          }}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          Back to Login
                        </button>
                      </div>
                    </div>
                  </form>
                ) : showForgotPassword ? (
                  <form onSubmit={loginForm.handleSubmit((data) => handleForgotPassword(data.email))}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          {...loginForm.register('email')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {loginForm.formState.errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {loginForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Sending...' : 'Reset Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="w-full text-blue-600 hover:text-blue-700"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                ) : isLogin ? (
                  <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          {...loginForm.register('email')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {loginForm.formState.errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {loginForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <input
                          type="password"
                          {...loginForm.register('password')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {loginForm.formState.errors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            {...loginForm.register('rememberMe')}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            Remember me
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Logging in...' : 'Login'}
                      </button>
                      <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setIsLogin(false)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Register
                        </button>
                      </p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={registerForm.handleSubmit(handleRegister)}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          {...registerForm.register('name')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {registerForm.formState.errors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {registerForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          {...registerForm.register('email')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {registerForm.formState.errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <input
                          type="password"
                          {...registerForm.register('password')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {registerForm.formState.errors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          {...registerForm.register('confirmPassword')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {registerForm.formState.errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {registerForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Registering...' : 'Register'}
                      </button>
                      <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setIsLogin(true)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Login
                        </button>
                      </p>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AuthModal;