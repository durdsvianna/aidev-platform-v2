'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// AI Model type
export interface AIModel {
  _id: string;
  name: string;
  provider: string;
  baseUrl: string;
  active: boolean;
  defaultParameters: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Message type
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Context type definition
interface AIModelContextType {
  models: AIModel[];
  loading: boolean;
  error: string | null;
  selectedModel: AIModel | null;
  conversation: Message[];
  fetchModels: () => Promise<void>;
  setSelectedModel: (model: AIModel | null) => void;
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
}

// Create context
const AIModelContext = createContext<AIModelContextType | undefined>(undefined);

// Check if we're in a build/static generation environment
const isServer = typeof window === 'undefined';
const isBuildTime = isServer && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

// Context provider component
export function AIModelProvider({ children }: { children: ReactNode }) {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState<boolean>(!isBuildTime);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);

  // Fetch all active models
  const fetchModels = async () => {
    if (isBuildTime) {
      console.log('Skipping API calls during build time');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/models/active');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch AI models');
      }
      
      setModels(result.data);
      
      // If models exist and no model is selected, select the first one
      if (result.data.length > 0 && !selectedModel) {
        setSelectedModel(result.data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching AI models:', err);
    } finally {
      setLoading(false);
    }
  };

  // Send a message to the selected AI model
  const sendMessage = async (content: string) => {
    if (isBuildTime) {
      console.log('Skipping API calls during build time');
      return;
    }

    if (!selectedModel) {
      setError('No AI model selected');
      return;
    }
    
    try {
      setLoading(true);
      
      // Add user message to conversation
      const userMessage: Message = { role: 'user', content };
      const updatedConversation = [...conversation, userMessage];
      setConversation(updatedConversation);
      
      // Send message to the API
      const response = await fetch(`/api/chat/${selectedModel._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedConversation
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to get response from AI model');
      }
      
      // Add assistant response to conversation
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.data.response
      };
      
      setConversation([...updatedConversation, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error sending message to AI model:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear the current conversation
  const clearConversation = () => {
    setConversation([]);
  };

  // Fetch models on component mount (client-side only)
  useEffect(() => {
    if (!isBuildTime) {
      fetchModels();
    }
  }, []);

  // Context value
  const value = {
    models,
    loading,
    error,
    selectedModel,
    conversation,
    fetchModels,
    setSelectedModel,
    sendMessage,
    clearConversation
  };

  return (
    <AIModelContext.Provider value={value}>
      {children}
    </AIModelContext.Provider>
  );
}

// Custom hook to use the AI model context
export function useAIModel() {
  const context = useContext(AIModelContext);
  
  if (context === undefined) {
    throw new Error('useAIModel must be used within an AIModelProvider');
  }
  
  return context;
} 