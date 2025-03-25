'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthSuccessPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated and redirect accordingly
    const checkAuthAndRedirect = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (data.authenticated) {
          // Check if there's a stored redirect path
          const storedRedirect = localStorage.getItem('auth_redirect');
          
          if (storedRedirect) {
            // Clear the stored redirect
            localStorage.removeItem('auth_redirect');
            // Redirect to the stored path
            router.push(storedRedirect);
          } else {
            // If no stored redirect, go to the sidebar layout
            router.push('/sidelayout');
          }
        } else {
          // If not authenticated, redirect to the login page
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };
    
    // Add a small delay to ensure any state changes have completed
    const timer = setTimeout(() => {
      checkAuthAndRedirect();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
        <h1 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          Authentication successful
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Please wait while we redirect you...</p>
      </div>
    </div>
  );
} 