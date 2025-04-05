'use client';

import { useState } from 'react';
import { GenerateMealPlanParams } from '@/lib/ai/openai';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  const testParams: GenerateMealPlanParams = {
    bmr: 1800,
    tdee: 2200,
    targetCalories: 2000,
    protein: 150,
    carbs: 200,
    fats: 70,
    duration: 30,
    mealPreferences: 'non-vegetarian',
    workoutFrequency: 3,
    workoutSchedule: ['Monday', 'Wednesday', 'Friday'],
    cardioDetails: '30 minutes running',
    medicalConditions: 'None'
  };

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-openai');
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate meal plan');
        setErrorDetails(data);
        throw new Error(data.error || 'Failed to generate meal plan');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">OpenAI API Test</h1>
      
      <div className="mb-6">
        <button
          onClick={handleTest}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Meal Plan Generation'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          
          {errorDetails && (
            <div className="mt-2">
              <p className="font-bold">Error Details:</p>
              <pre className="bg-red-50 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Meal Plan</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 