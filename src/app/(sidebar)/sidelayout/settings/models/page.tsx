'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner, FaSyncAlt, FaExclamationTriangle } from 'react-icons/fa';

type AIModel = {
  _id: string;
  name: string;
  provider: string;
  baseUrl: string;
  active: boolean;
  defaultParameters: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

type ModelFormData = {
  name: string;
  provider: string;
  apiKey?: string;
  baseUrl: string;
  active: boolean;
};

export default function ModelsPage() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ModelFormData>({
    name: '',
    provider: '',
    apiKey: '',
    baseUrl: '',
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Fetch models on component mount
  useEffect(() => {
    fetchModels();
  }, []);

  // Fetch all models from the API
  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/models');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch models');
      }
      
      setModels(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching models:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      provider: '',
      apiKey: '',
      baseUrl: '',
      active: true,
    });
    setEditingModelId(null);
  };

  // Open form for creating a new model
  const handleAddNew = () => {
    resetForm();
    setIsFormVisible(true);
  };

  // Open form for editing an existing model
  const handleEdit = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/models/${id}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch model details');
      }
      
      // Pre-fill form with model data (excluding apiKey which we can't retrieve)
      setFormData({
        name: result.data.name,
        provider: result.data.provider,
        apiKey: '', // API key is not returned for security reasons
        baseUrl: result.data.baseUrl,
        active: result.data.active,
      });
      
      setEditingModelId(id);
      setIsFormVisible(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching model details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle model deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this model?')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/models/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete model');
      }
      
      // Remove deleted model from the list
      setModels(models.filter(model => model._id !== id));
      
      // If we were editing this model, close the form
      if (editingModelId === id) {
        setIsFormVisible(false);
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting model:', err);
    } finally {
      setLoading(false);
    }
  };

  // Verify an API key before saving
  const verifyApiKey = async (provider: string, apiKey: string, baseUrl: string): Promise<boolean> => {
    try {
      setIsVerifying(true);
      setError(null);
      
      const response = await fetch('/api/models/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, apiKey, baseUrl }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to verify API key');
      }
      
      if (!result.isValid) {
        setError('The API key appears to be invalid. Please check and try again.');
        return false;
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error verifying API key:', err);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle form submission for creating/updating models with verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Verify the API key first if provided
      if (formData.apiKey) {
        const isValid = await verifyApiKey(
          formData.provider,
          formData.apiKey,
          formData.baseUrl
        );
        
        if (!isValid) {
          setIsSubmitting(false);
          return; // Stop if verification failed
        }
      }
      
      const url = editingModelId 
        ? `/api/models/${editingModelId}` 
        : '/api/models';
      
      const method = editingModelId ? 'PATCH' : 'POST';
      
      // Only include apiKey if it's provided (for updates)
      const data: ModelFormData = { ...formData };
      if (!data.apiKey && method === 'PATCH') {
        delete data.apiKey;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || `Failed to ${editingModelId ? 'update' : 'create'} model`);
      }
      
      // Refresh the model list
      await fetchModels();
      
      // Close form and reset
      setIsFormVisible(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(`Error ${editingModelId ? 'updating' : 'creating'} model:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resetting the models collection
  const handleReset = async () => {
    if (!confirm('WARNING: This will delete all AI models. This action cannot be undone. Are you sure you want to continue?')) {
      return;
    }
    
    try {
      setIsResetting(true);
      setError(null);
      
      const response = await fetch('/api/models/reset', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to reset models');
      }
      
      // Refresh the model list (should be empty now)
      await fetchModels();
      
      alert('Models collection has been reset successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error resetting models:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Models</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage the AI models used in your platform
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleAddNew}
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaPlus className="mr-2" />
            Add New Model
          </button>
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isResetting ? (
              <FaSpinner className="mr-2 animate-spin" />
            ) : (
              <FaSyncAlt className="mr-2" />
            )}
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900/50 dark:text-red-300">
          <p>{error}</p>
        </div>
      )}

      {isFormVisible && (
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {editingModelId ? 'Edit Model' : 'Add New Model'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Model Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white p-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="e.g., gpt-4, claude-3-opus"
                />
              </div>
              <div>
                <label htmlFor="provider" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Provider
                </label>
                <input
                  type="text"
                  id="provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white p-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="e.g., OpenAI, Anthropic"
                />
              </div>
              <div>
                <label htmlFor="baseUrl" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Base URL
                </label>
                <input
                  type="url"
                  id="baseUrl"
                  name="baseUrl"
                  value={formData.baseUrl}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white p-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder={
                    formData.provider?.toLowerCase() === 'anthropic' 
                      ? 'https://api.anthropic.com' 
                      : formData.provider?.toLowerCase() === 'openai'
                        ? 'https://api.openai.com/v1/chat/completions'
                        : 'e.g., https://api.example.com'
                  }
                />
                {formData.provider?.toLowerCase() === 'anthropic' && (
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    For Anthropic/Claude, use https://api.anthropic.com
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="apiKey" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  API Key {editingModelId && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  id="apiKey"
                  name="apiKey"
                  value={formData.apiKey}
                  onChange={handleChange}
                  required={!editingModelId && formData.provider?.toLowerCase() !== 'mock'}
                  className="block w-full rounded-md border border-gray-300 bg-white p-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder={formData.provider?.toLowerCase() === 'mock' ? 'No API key required for Mock provider' : 'Enter API key'}
                />
                {formData.provider?.toLowerCase() === 'mock' && (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                    No API key required for Mock provider
                  </p>
                )}
              </div>
            </div>
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                Active
              </label>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting || isVerifying}
                className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isVerifying ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Save
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormVisible(false);
                  resetForm();
                }}
                className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            </div>
            
            {/* Add a notice about API key verification */}
            <div className="mt-4 flex items-start rounded-md bg-yellow-50 p-4 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
              <FaExclamationTriangle className="mr-3 h-5 w-5 flex-shrink-0" />
              <div className="text-sm">
                <p><strong>Note:</strong> API keys are stored securely and verified with the provider before saving.</p>
                <p className="mt-1">You will need a valid API key from Anthropic, OpenAI, or other supported providers to use the AI assistant features.</p>
              </div>
            </div>
          </form>
        </div>
      )}

      {loading && !isSubmitting ? (
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : models.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">No AI models found. Add your first model to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Provider
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {models.map((model) => (
                <tr key={model._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {model.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {model.provider}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      model.active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {model.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(model.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(model._id)}
                      className="mr-3 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(model._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 