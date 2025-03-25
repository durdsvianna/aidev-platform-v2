'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Check authentication status from API
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (data.authenticated) {
          setIsAuthenticated(true);
          setIsLoading(false);
        } else if (pathname?.startsWith('/sidelayout')) {
          // Redirect to login if trying to access protected route
          const redirectPath = encodeURIComponent(pathname || '/sidelayout');
          router.push(`/login?redirectTo=${redirectPath}`);
        } else {
          // Public route, continue loading
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, [pathname, router]);
  
  // Show nothing while checking authentication
  if (isLoading && pathname?.startsWith('/sidelayout')) {
    return null;
  }
  
  // Render the children
  return <>{children}</>;
} 