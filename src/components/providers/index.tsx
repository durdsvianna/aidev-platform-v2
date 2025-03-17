'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { AIModelProvider } from '@/app/contexts/AIModelContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AIModelProvider>
        {children}
      </AIModelProvider>
    </ThemeProvider>
  );
} 