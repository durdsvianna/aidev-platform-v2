'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaGoogle, FaEnvelope, FaLock, FaExclamationTriangle } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if user is already logged in by calling the status API
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (data.authenticated) {
          // If there's a redirectTo parameter, use it; otherwise, go to sidebar layout
          const redirectTo = searchParams?.get('redirectTo');
          router.push(redirectTo || '/sidelayout');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    }
    
    checkAuth();
    
    // Check for error parameter in URL
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      const errorMessages: { [key: string]: string } = {
        'google_auth_denied': 'Google authentication was denied',
        'missing_params': 'Missing required parameters',
        'invalid_state': 'Invalid state parameter',
        'token_exchange_failed': 'Failed to exchange token with Google',
        'user_info_failed': 'Failed to get user information from Google',
        'unexpected': 'An unexpected error occurred'
      };
      
      setError(errorMessages[errorParam] || 'Authentication error');
    }
  }, [router, searchParams]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Login failed');
        setIsLoading(false);
        return;
      }
      
      // If there's a redirectTo parameter, use it; otherwise, go to sidebar layout
      const redirectTo = searchParams?.get('redirectTo');
      router.push(redirectTo || '/sidelayout');
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = () => {
    // To preserve the redirectTo parameter when redirecting to Google OAuth
    const redirectTo = searchParams?.get('redirectTo');
    const redirectParam = redirectTo ? `?redirectTo=${redirectTo}` : '';
    
    // Store the redirect path in localStorage
    if (redirectTo) {
      localStorage.setItem('auth_redirect', redirectTo);
    }
    
    window.location.href = '/api/auth/google';
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Access your AI Development Platform account
          </p>
        </div>
        
        {error && (
          <div className="mb-4 flex items-center rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
            <FaExclamationTriangle className="mr-2 h-4 w-4" />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FaEnvelope />
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FaLock />
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="mb-4 w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="relative mb-4 flex items-center justify-center">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="mx-4 flex-shrink text-gray-500 dark:text-gray-400">Or</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          className="mb-4 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
          Sign in with Google
        </button>
        
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
} 