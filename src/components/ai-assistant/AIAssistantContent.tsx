'use client';

import React, { useState } from 'react';
import { useAIModel } from '@/app/contexts/AIModelContext';
import ModelSelector from '@/components/ai-assistant/ModelSelector';
import ChatInterface from '@/components/ai-assistant/ChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, HelpCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AIAssistantContent() {
  const { error } = useAIModel();
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">AI Assistant</h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={() => setShowTroubleshooting(!showTroubleshooting)}
              className="text-xs underline hover:text-white"
            >
              {showTroubleshooting ? 'Hide troubleshooting' : 'Show troubleshooting tips'}
            </button>
          </AlertDescription>
        </Alert>
      )}

      {(showTroubleshooting || error?.includes('Unsupported AI provider')) && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Troubleshooting AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="provider-error">
                <AccordionTrigger className="text-sm">
                  "Unsupported AI provider" error
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p>This error means your AI model provider isn't correctly configured. Here's how to fix it:</p>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                      <li>Go to <strong>Settings &gt; Models</strong> and check the provider field.</li>
                      <li>For Anthropic/Claude models, the provider should be set to <code className="bg-muted px-1 rounded">anthropic</code></li>
                      <li>The base URL should be <code className="bg-muted px-1 rounded">https://api.anthropic.com</code></li>
                      <li>Click the "Reset" button and try adding the model again with the correct settings.</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="api-key">
                <AccordionTrigger className="text-sm">
                  API Key Issues
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p>If your API key isn't working:</p>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                      <li>Verify that your API key is correct and active from the provider's website</li>
                      <li>Make sure you've selected the correct model in the sidebar</li>
                      <li>Try resetting your models (Settings &gt; Models &gt; Reset) and adding the key again</li>
                      <li>Check that your account has sufficient credits with the AI provider</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="quick-fix">
                <AccordionTrigger className="text-sm">
                  Quick Fix: Add Default Model
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p>To quickly add a working Anthropic/Claude model:</p>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                      <li>Get your Anthropic API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">console.anthropic.com</a></li>
                      <li>Use the API endpoint: <code className="bg-muted px-1 rounded">POST /api/models/default?apiKey=your-api-key</code></li>
                      <li>Refresh this page after adding the model</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Models</CardTitle>
            </CardHeader>
            <CardContent>
              <ModelSelector />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              <ChatInterface />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 