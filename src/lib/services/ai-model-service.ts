import { fetchJson } from '@/lib/fetch-utils';

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

class AIModelService {
  private models: AIModel[] = [];
  private initialized = false;

  async getAll(): Promise<AIModel[]> {
    if (!this.initialized) {
      await this.fetchModels();
    }
    return this.models;
  }

  async fetchModels(): Promise<void> {
    try {
      const response = await fetchJson<{ success: boolean; data: AIModel[] }>('/api/models');
      if (response.success) {
        this.models = response.data;
        this.initialized = true;
      }
    } catch (error) {
      console.error('Error fetching AI models:', error);
      // For demo purposes, provide some sample models if API fails
      this.models = [
        {
          _id: '1',
          name: 'GPT-4o',
          provider: 'OpenAI',
          baseUrl: 'https://api.openai.com/v1/chat/completions',
          active: true,
          defaultParameters: { model: 'gpt-4o', temperature: 0.7 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Claude 3 Opus',
          provider: 'Anthropic',
          baseUrl: 'https://api.anthropic.com/v1/messages',
          active: true,
          defaultParameters: { model: 'claude-3-opus-20240229', temperature: 0.7 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.initialized = true;
    }
  }

  async getActiveModels(): Promise<AIModel[]> {
    const models = await this.getAll();
    return models.filter(model => model.active);
  }

  getByProvider(provider: string): AIModel[] {
    return this.models.filter(model => 
      model.provider.toLowerCase() === provider.toLowerCase()
    );
  }
}

export const aiModelService = new AIModelService(); 