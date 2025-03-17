'use client';

import React from 'react';
import { useAIModel } from '@/app/contexts/AIModelContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ModelSelector() {
  const { models, loading, error, selectedModel, setSelectedModel, fetchModels, clearConversation } = useAIModel();

  const handleModelChange = (modelId: string) => {
    const model = models.find(m => m._id === modelId);
    if (model) {
      setSelectedModel(model);
      clearConversation();
    }
  };

  // Group models by provider
  const modelsByProvider = models.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, typeof models>);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Available Models</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchModels} 
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="text-xs">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {loading && <div className="text-sm text-muted-foreground">Loading models...</div>}
      
      {!loading && models.length === 0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            No AI models available. Please add models in the admin panel or check your MongoDB connection.
          </div>
          <Alert className="text-xs">
            <AlertDescription>
              <p>To add a model, use the API:</p>
              <pre className="mt-2 p-2 bg-muted rounded-md overflow-x-auto text-xs">
                {`POST /api/models
{
  "name": "GPT-4",
  "provider": "openai",
  "apiKey": "your-api-key",
  "baseUrl": "https://api.openai.com/v1/chat/completions",
  "active": true,
  "defaultParameters": {
    "model": "gpt-4",
    "temperature": 0.7
  }
}`}
              </pre>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!loading && models.length > 0 && (
        <RadioGroup 
          value={selectedModel?._id} 
          onValueChange={handleModelChange}
          className="space-y-4"
        >
          {Object.entries(modelsByProvider).map(([provider, providerModels]) => (
            <div key={provider} className="space-y-2">
              <h4 className="text-xs uppercase text-muted-foreground font-semibold">
                {provider}
              </h4>
              <div className="space-y-2">
                {providerModels.map(model => (
                  <div key={model._id} className="flex items-center space-x-2">
                    <RadioGroupItem value={model._id} id={model._id} />
                    <Label htmlFor={model._id} className="flex items-center gap-2 cursor-pointer">
                      {model.name}
                      <Badge variant="outline" className="text-xs">
                        {model.provider}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
} 