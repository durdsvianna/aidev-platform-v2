'use client';

import Link from 'next/link';
import { FaRocket, FaUserFriends, FaGoogle, FaBrain } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { userService } from '@/lib/services/user-service';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is already logged in
    setIsLoggedIn(userService.isLoggedIn());
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 pt-24 pb-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              AI Development Platform
            </h1>
            <p className="mb-8 text-lg md:text-xl">
              Build, deploy, and manage AI models with an intuitive platform designed for developers.
            </p>
            
            {isLoggedIn ? (
              <Link
                href="/sidelayout"
                className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-md transition hover:bg-gray-100 focus:outline-none"
              >
                <FaRocket className="mr-2" />
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-md transition hover:bg-gray-100 focus:outline-none"
                >
                  Get Started
                </Link>
                <Link
                  href="/api/auth/google"
                  className="inline-flex items-center rounded-md bg-red-500 px-6 py-3 text-base font-medium text-white shadow-md transition hover:bg-red-600 focus:outline-none"
                >
                  <FaGoogle className="mr-2" />
                  Sign in with Google
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Wave effect */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-gray-50 dark:text-gray-900 fill-current">
            <path fillOpacity="1" d="M0,96L48,128C96,160,192,224,288,224C384,224,480,160,576,149.3C672,139,768,181,864,197.3C960,213,1056,203,1152,176C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold leading-tight text-gray-900 dark:text-white md:text-4xl">
              Platform Features
            </h2>
            <p className="mb-12 text-lg text-gray-600 dark:text-gray-400">
              Everything you need to accelerate your AI development workflow
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <FaBrain className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">AI Model Management</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create, configure, and manage your AI models in one centralized place.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 inline-flex rounded-full bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <FaGoogle className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Google Authentication</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Secure and seamless login with your Google account. No need to remember another password.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 inline-flex rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <FaUserFriends className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Developer Profiles</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manage developer profiles and associate them with technology stacks and projects.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 text-white md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">
              Ready to Supercharge Your AI Development?
            </h2>
            <p className="mb-8 text-lg">
              Join our platform today and accelerate your AI projects with powerful tools and easy-to-use interfaces.
            </p>
            
            {isLoggedIn ? (
              <Link
                href="/sidelayout"
                className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-md transition hover:bg-gray-100 focus:outline-none"
              >
                <FaRocket className="mr-2" />
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-md transition hover:bg-gray-100 focus:outline-none"
                >
                  Create an Account
                </Link>
                <Link
                  href="/api/auth/google"
                  className="inline-flex items-center rounded-md bg-red-500 px-6 py-3 text-base font-medium text-white shadow-md transition hover:bg-red-600 focus:outline-none"
                >
                  <FaGoogle className="mr-2" />
                  Sign in with Google
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}