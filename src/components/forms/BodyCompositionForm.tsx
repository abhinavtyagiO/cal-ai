'use client';

import { useState, useEffect } from 'react';
import { OnboardingFormData } from '@/types/onboarding';

interface BodyCompositionFormProps {
  onSubmit: (data: Partial<OnboardingFormData>) => void;
  data?: Partial<OnboardingFormData>;
  isLoading?: boolean;
}

export default function BodyCompositionForm({ onSubmit, data, isLoading = false }: BodyCompositionFormProps) {
  const [formData, setFormData] = useState({
    current_body_fat: data?.current_body_fat || '',
    desired_body_fat: data?.desired_body_fat || '',
    duration: data?.duration || '',
  });

  // Update form data when data prop changes
  useEffect(() => {
    if (data) {
      setFormData({
        current_body_fat: data.current_body_fat || '',
        desired_body_fat: data.desired_body_fat || '',
        duration: data.duration || '',
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      current_body_fat: Number(formData.current_body_fat),
      desired_body_fat: Number(formData.desired_body_fat),
      duration: Number(formData.duration),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="current_body_fat" className="block text-sm font-medium text-gray-800">
          Current Body Fat Percentage
        </label>
        <input
          type="number"
          id="current_body_fat"
          value={formData.current_body_fat}
          onChange={(e) => setFormData({ ...formData, current_body_fat: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="1"
          max="50"
          step="0.1"
          required
          disabled={isLoading}
        />
        <p className="mt-1 text-sm text-gray-700">
          If you're not sure, you can estimate or use a body fat calculator
        </p>
      </div>

      <div>
        <label htmlFor="desired_body_fat" className="block text-sm font-medium text-gray-800">
          Desired Body Fat Percentage
        </label>
        <input
          type="number"
          id="desired_body_fat"
          value={formData.desired_body_fat}
          onChange={(e) => setFormData({ ...formData, desired_body_fat: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="1"
          max="50"
          step="0.1"
          required
          disabled={isLoading}
        />
        <p className="mt-1 text-sm text-gray-700">
          Typical ranges: Men 10-20%, Women 18-28%
        </p>
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-800">
          Duration of Diet Plan (months)
        </label>
        <input
          type="number"
          id="duration"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="1"
          max="24"
          required
          disabled={isLoading}
        />
        <p className="mt-1 text-sm text-gray-700">
          How long would you like to follow this diet plan?
        </p>
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