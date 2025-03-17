import React from 'react';
import Link from 'next/link';
import { FaCode } from 'react-icons/fa';
import type Technology from '@/models/Technology';

interface TechnologyCardProps {
  technology: Technology;
}

export default function TechnologyCard({ technology }: TechnologyCardProps) {
  return (
    <div className="flex flex-col rounded-md border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 flex items-center">
        <FaCode className="mr-2 text-blue-500 dark:text-blue-400" />
        <h3 className="font-medium text-gray-900 dark:text-white">
          {technology.name}
        </h3>
      </div>
      
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        {technology.description.length > 80
          ? `${technology.description.substring(0, 80)}...`
          : technology.description}
      </p>
      
      <div className="mt-auto">
        <Link
          href={`/sidelayout/technologies/${technology.id}`}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View details
        </Link>
      </div>
    </div>
  );
} 