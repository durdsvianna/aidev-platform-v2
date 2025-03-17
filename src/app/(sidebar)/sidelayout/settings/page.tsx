import React from 'react';
import { Metadata } from 'next';
import { FaCog, FaBrain, FaUsers, FaShieldAlt } from 'react-icons/fa';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Settings - AI Development Platform',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage your AI Development Platform settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/sidelayout/settings/models"
          className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <FaBrain className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">AI Models</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Manage AI models, providers, and API configurations
          </p>
        </Link>

        <Link
          href="/sidelayout/users"
          className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
            <FaUsers className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Manage users, permissions, and access control
          </p>
        </Link>

        <Link
          href="/sidelayout/settings/security"
          className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
            <FaShieldAlt className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Configure security settings, API keys, and encryption options
          </p>
        </Link>
      </div>
    </div>
  );
} 