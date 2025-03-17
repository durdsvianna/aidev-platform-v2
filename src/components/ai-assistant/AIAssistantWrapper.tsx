'use client';

import React from 'react';
import { AIModelProvider } from '@/app/contexts/AIModelContext';
import AIAssistantContent from '@/components/ai-assistant/AIAssistantContent';

export default function AIAssistantWrapper() {
  return (
    <AIModelProvider>
      <AIAssistantContent />
    </AIModelProvider>
  );
} 