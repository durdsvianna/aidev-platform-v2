'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // Fetch user data from the status API
    async function fetchUserData() {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (!data.authenticated) {
          // Redirect to login if not authenticated
          router.push('/login');
          return;
        }
        
        setUser(data.user);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      }
    }
    
    fetchUserData();
  }, [router]);
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-4 py-8 pt-24 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-4xl">
        <Link 
          href="/"
          className="mb-6 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute -bottom-12 left-6">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200 dark:border-gray-700 dark:bg-gray-700">
                {user.googleProfilePicture ? (
                  <img 
                    src={user.googleProfilePicture} 
                    alt={user.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUser className="h-12 w-12 text-gray-400" />
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-14 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <Link 
                href="/profile/edit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <span className="flex items-center">
                  <FaEdit className="mr-2 h-4 w-4" />
                  Edit Profile
                </span>
              </Link>
            </div>
            
            <div className="mt-6">
              <div className="mb-4 flex items-center">
                <FaEnvelope className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Email:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">{user.email}</span>
              </div>
              
              <div className="mb-4 flex items-center">
                <FaCalendar className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Joined:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">{formatDate(user.createdAt)}</span>
              </div>
              
              <div className="flex items-center">
                <FaCalendar className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Last Login:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">{formatDate(user.lastLogin)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Account Information</h2>
          
          <div className="mb-4">
            <div className="mb-2 font-medium text-gray-900 dark:text-white">Account Type:</div>
            <div className="flex items-center rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-700">
              {user.isGoogleUser ? (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Google Account
                </span>
              ) : (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Standard Account
                </span>
              )}
            </div>
          </div>
          
          {user.description && (
            <div className="mb-4">
              <div className="mb-2 font-medium text-gray-900 dark:text-white">Bio:</div>
              <div className="rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">{user.description}</p>
              </div>
            </div>
          )}
          
          <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 