import { connectToDatabase } from '../database';
import AIModel, { IAIModel } from '@/models/AIModel';

// Types for chat functionality
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatOptions {
  modelId: string;
  messages: ChatMessage[];
  parameters?: Record<string, any>;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  data?: {
    response: string;
    model: {
      id: string;
      name: string;
      provider: string;
    };
  };
  error?: string;
}

// AI Chat Service class
export class AIChatService {
  // Send a message to a specific AI model
  static async sendMessage(options: ChatOptions): Promise<ChatResponse> {
    try {
      await connectToDatabase();
      
      // Find the AI model with apiKey included
      const model = await AIModel.findById(options.modelId).select('+apiKey');
      
      if (!model) {
        return { 
          success: false, 
          error: 'AI model not found' 
        };
      }
      
      if (!model.active) {
        return { 
          success: false, 
          error: 'This AI model is currently inactive' 
        };
      }
      
      // Combine default parameters with provided parameters
      const parameters = {
        ...(model.defaultParameters?.toObject() || {}),
        ...(options.parameters || {})
      };
      
      // Call the appropriate AI provider based on the model type
      let response: string;
      
      switch (model.provider.toLowerCase()) {
        case 'openai':
          response = await this.callOpenAI(model, options.messages, parameters);
          break;
        case 'claude':
        case 'anthropic':
          response = await this.callClaude(model, options.messages, parameters);
          break;
        case 'deepseek':
          response = await this.callDeepSeek(model, options.messages, parameters);
          break;
        case 'mock':
          response = await this.callMockModel(model, options.messages, parameters);
          break;
        default:
          return {
            success: false,
            error: `Unsupported AI provider: ${model.provider}`
          };
      }
      
      return {
        success: true,
        data: {
          response,
          model: {
            id: model._id.toString(),
            name: model.name,
            provider: model.provider
          }
        }
      };
    } catch (error) {
      console.error('Error in AI chat service:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error in AI chat service'
      };
    }
  }
  
  // Call OpenAI API
  private static async callOpenAI(
    model: IAIModel,
    messages: ChatMessage[],
    parameters: Record<string, any>
  ): Promise<string> {
    try {
      const response = await fetch(model.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${model.apiKey}`
        },
        body: JSON.stringify({
          model: parameters.model || 'gpt-4',
          messages,
          temperature: parameters.temperature || 0.7,
          max_tokens: parameters.max_tokens || 1000,
          ...parameters
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || JSON.stringify(error)}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw error;
    }
  }
  
  // Call Claude API
  private static async callClaude(
    model: IAIModel,
    messages: ChatMessage[],
    parameters: Record<string, any>
  ): Promise<string> {
    try {
      // The Claude API endpoint should be the complete path
      const apiEndpoint = model.baseUrl.endsWith('/messages') 
        ? model.baseUrl 
        : `${model.baseUrl}/v1/messages`;
      
      console.log(`Calling Claude API at: ${apiEndpoint}`);
      console.log(`Using model: ${parameters.model || 'claude-3-7-sonnet-latest'}`);
      
      // Anthropic uses x-api-key header, not the standard Bearer token authentication
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': model.apiKey, // Direct API key, not as Bearer token
        'anthropic-version': '2023-06-01'
      };

      console.log('Using headers format:', Object.keys(headers));
      console.log('Using API Key:', model.apiKey);
        
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: parameters.model || 'claude-3-7-sonnet-latest',
          messages,
          temperature: parameters.temperature || 0.7,
          max_tokens: parameters.max_tokens || 4000,
          ...parameters
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { raw: errorText };
        }
        
        console.error('Claude API error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          headers: Object.fromEntries(Array.from(response.headers.entries()))
        });
        
        throw new Error(`Claude API error (${response.status}): ${
          errorData.error?.message || 
          errorData.error || 
          errorData.raw || 
          response.statusText
        }`);
      }
      
      const data = await response.json();
      console.log('Successful response from Claude API');
      
      // Anthropic response structure: { content: [{ type: "text", text: "..." }] }
      return data.content?.[0]?.text || data.choices?.[0]?.message?.content || 'No response from Claude';
    } catch (error) {
      console.error('Error calling Claude:', error);
      throw error;
    }
  }
  
  // Call DeepSeek API
  private static async callDeepSeek(
    model: IAIModel,
    messages: ChatMessage[],
    parameters: Record<string, any>
  ): Promise<string> {
    try {
      const response = await fetch(model.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${model.apiKey}`
        },
        body: JSON.stringify({
          model: parameters.model || 'deepseek-chat',
          messages,
          temperature: parameters.temperature || 0.7,
          max_tokens: parameters.max_tokens || 1000,
          ...parameters
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`DeepSeek API error: ${error.error?.message || JSON.stringify(error)}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling DeepSeek:', error);
      throw error;
    }
  }
  
  // Call Mock Model (no API key required)
  private static async callMockModel(
    model: IAIModel,
    messages: ChatMessage[],
    parameters: Record<string, any>
  ): Promise<string> {
    try {
      console.log('Using mock model - no API call required');
      
      // Get the last user message
      const lastMessage = messages.find(m => m.role === 'user');
      const query = lastMessage?.content || '';
      
      // Wait a bit to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a response based on the query
      let response = '';
      
      if (query.match(/hello|hi|hey/i)) {
        response = `Hello! I'm a mock AI assistant powered by the ${model.name} model. How can I help you today?`;
      } else if (query.match(/how are you|how do you feel|how's it going/i)) {
        response = "I'm just a simulated AI response, but I'm working perfectly! This response is generated locally without using any API keys.";
      } else if (query.match(/what can you do|capabilities|features/i)) {
        response = "I'm a mock AI model that can provide simulated responses without requiring an API key. This is useful for development, testing, and demonstration purposes. In a real implementation, you would connect to actual AI providers like OpenAI, Anthropic, or DeepSeek.";
      } else if (query.match(/weather|temperature|forecast/i)) {
        response = "I'm a mock model and don't have access to real-time weather data. To get weather information, you would need to integrate with a weather API or use a more advanced AI model with internet access.";
      } else if (query.match(/code|programming|develop|javascript|python|react/i)) {
        response = "Here's a simple example of a JavaScript function:\n\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('Developer'));\n```\n\nKeep in mind that this code is pre-written as part of my mock responses, not dynamically generated by a real AI model.";
      } else if (query.match(/time|date|day/i)) {
        const now = new Date();
        response = `The current server time is ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}. Note that this is coming from your server's time, not from AI processing.`;
      } else {
        response = `This is a simulated response from the mock model "${model.name}". Your query was: "${query}"\n\nIn a real implementation, this would be generated by an actual AI API. This mock provider allows you to test the interface without using API credits or requiring real API keys.`;
      }
      
      // Add a note about simulation
      response += "\n\n[Note: This response was generated by the Mock provider, which doesn't require an API key.]";
      
      return response;
    } catch (error) {
      console.error('Error in mock model:', error);
      return "Sorry, there was an error generating a mock response. This is unusual since no external API is being called. Please check the server logs.";
    }
  }
} 