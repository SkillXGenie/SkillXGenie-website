import { createClient } from '@supabase/supabase-js';

// Replace with your actual project values
const supabaseUrl = 'https://jtdokisjwkgcohtobgxz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0ZG9raXNqd2tnY29odG9iZ3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDIzMTAsImV4cCI6MjA2MTA3ODMxMH0.-zvpzytR8gIYcnUgjZ9mFDKSrvrC3Kax1tjW6E1zznE';

const supabase = createClient(supabaseUrl, supabaseKey);

import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

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

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    const { email, password } = data;
  
    const { error } = await supabase.auth.signInWithPassword({ email, password });
  
    if (error) {
      console.error('Login error:', error.message);
      alert('Login failed: ' + error.message);
    } else {
      alert('Logged in successfully!');
      onClose();
    }
  };
  
  const handleRegister = async (data: RegisterFormData) => {
    const { email, password } = data;
  
    // Log the email of the user who is registering
    console.log('User signing up:', email);
  
    const { error } = await supabase.auth.signUp({ email, password });
  
    if (error) {
      console.error('Signup error:', error.message);
      alert('Signup failed: ' + error.message);
    } else {
      alert('Registered successfully! Please check your email for confirmation.');
      onClose();
    }
  };
  

  const handleForgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
  
    if (error) {
      console.error('Password reset error:', error.message);
      alert('Reset failed: ' + error.message);
    } else {
      alert('Password reset link sent! Check your email.');
      setShowForgotPassword(false);
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
                    {showForgotPassword ? 'Reset Password' : isLogin ? 'Login' : 'Register'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {showForgotPassword ? (
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
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Reset Password
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
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Login
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
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Register
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