'use client';

import { useState, useEffect } from 'react';
import { OnboardingFormData } from '@/types/onboarding';

interface DietaryPreferencesFormProps {
  onSubmit: (data: Partial<OnboardingFormData>) => void;
  data?: Partial<OnboardingFormData>;
  isLoading?: boolean;
}

export default function DietaryPreferencesForm({ onSubmit, data, isLoading = false }: DietaryPreferencesFormProps) {
  const [formData, setFormData] = useState({
    meal_preferences: data?.meal_preferences || '',
    food_allergies: data?.food_allergies || '',
    food_restrictions: data?.food_restrictions || '',
  });

  // Update form data when data prop changes
  useEffect(() => {
    if (data) {
      setFormData({
        meal_preferences: data.meal_preferences || '',
        food_allergies: data.food_allergies || '',
        food_restrictions: data.food_restrictions || '',
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      meal_preferences: formData.meal_preferences as 'vegetarian' | 'non-vegetarian',
      food_allergies: formData.food_allergies || undefined,
      food_restrictions: formData.food_restrictions || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="meal_preferences" className="block text-sm font-medium text-gray-700">
          Dietary Preference
        </label>
        <select
          id="meal_preferences"
          value={formData.meal_preferences}
          onChange={(e) => setFormData({ ...formData, meal_preferences: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          disabled={isLoading}
        >
          <option value="">Select your dietary preference</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="non-vegetarian">Non-vegetarian</option>
        </select>
      </div>

      <div>
        <label htmlFor="food_allergies" className="block text-sm font-medium text-gray-700">
          Food Allergies (if any)
        </label>
        <textarea
          id="food_allergies"
          value={formData.food_allergies}
          onChange={(e) => setFormData({ ...formData, food_allergies: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          placeholder="List any food allergies you have..."
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="food_restrictions" className="block text-sm font-medium text-gray-700">
          Food Restrictions (if any)
        </label>
        <textarea
          id="food_restrictions"
          value={formData.food_restrictions}
          onChange={(e) => setFormData({ ...formData, food_restrictions: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          placeholder="List any food restrictions you have..."
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </form>
  );
} 