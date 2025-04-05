'use client';

import { useState } from 'react';
import { OnboardingFormData } from '@/types/onboarding';

interface DietaryPreferencesFormProps {
  onSubmit: (data: Partial<OnboardingFormData>) => void;
  data?: Partial<OnboardingFormData>;
}

export default function DietaryPreferencesForm({ onSubmit, data }: DietaryPreferencesFormProps) {
  const [formData, setFormData] = useState({
    meal_preferences: data?.meal_preferences || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      meal_preferences: formData.meal_preferences as 'vegetarian' | 'non-vegetarian',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          What is your dietary preference?
        </label>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="vegetarian"
              name="meal_preferences"
              value="vegetarian"
              checked={formData.meal_preferences === 'vegetarian'}
              onChange={(e) => setFormData({ ...formData, meal_preferences: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              required
            />
            <label htmlFor="vegetarian" className="ml-3 block text-sm font-medium text-gray-700">
              Vegetarian
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="non-vegetarian"
              name="meal_preferences"
              value="non-vegetarian"
              checked={formData.meal_preferences === 'non-vegetarian'}
              onChange={(e) => setFormData({ ...formData, meal_preferences: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              required
            />
            <label htmlFor="non-vegetarian" className="ml-3 block text-sm font-medium text-gray-700">
              Non-Vegetarian
            </label>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          This will help us customize meal recommendations based on your dietary preferences.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </form>
  );
} 