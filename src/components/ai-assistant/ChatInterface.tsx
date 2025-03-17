'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAIModel } from '@/app/contexts/AIModelContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Trash2, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

export default function ChatInterface() {
  const { selectedModel, conversation, loading, error, sendMessage, clearConversation } = useAIModel();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Reset height to auto to get the correct scrollHeight
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  // Handle message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      sendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Scroll to bottom when conversation updates
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto mb-4 space-y-4 p-2">
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
            {selectedModel ? (
              <div className="text-center">
                <p>Start a conversation with {selectedModel.name}</p>
                <p className="text-xs mt-2">Type a message below to begin</p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Database className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p>Select an AI model to start chatting</p>
                <Alert className="mt-4 max-w-md">
                  <AlertDescription className="text-xs">
                    If no models are available, make sure MongoDB is running and add models using the API.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        ) : (
          conversation.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col max-w-[80%] rounded-lg p-4",
                msg.role === 'user'
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="whitespace-pre-wrap break-words">
                {msg.content}
              </div>
              
              {/* Add "Create Prompt" button for assistant messages */}
              {msg.role !== 'user' && (
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      const encodedContent = encodeURIComponent(msg.content);
                      router.push(`/sidelayout/prompts/new?description=${encodedContent}`);
                    }}
                  >
                    Create Prompt
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t pt-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={selectedModel ? `Message ${selectedModel.name}...` : "Select a model first..."}
            className="min-h-[60px] resize-none"
            disabled={!selectedModel || loading}
          />
          <div className="flex flex-col gap-2">
            <Button 
              type="submit" 
              size="icon" 
              disabled={!selectedModel || !message.trim() || loading}
            >
              <Send className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={clearConversation}
              disabled={conversation.length === 0 || loading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 