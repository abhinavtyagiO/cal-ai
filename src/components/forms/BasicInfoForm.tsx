'use client';

import { useState, useEffect } from 'react';
import { OnboardingFormData } from '@/types/onboarding';

interface BasicInfoFormProps {
  onSubmit: (data: Partial<OnboardingFormData>) => void;
  data?: Partial<OnboardingFormData>;
  isLoading?: boolean;
}

export default function BasicInfoForm({ onSubmit, data, isLoading = false }: BasicInfoFormProps) {
  const [formData, setFormData] = useState({
    name: data?.name || '',
    age: data?.age || '',
    height: data?.height || '',
    current_weight: data?.current_weight || '',
    desired_weight: data?.desired_weight || '',
  });

  // Update form data when data prop changes
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        age: data.age || '',
        height: data.height || '',
        current_weight: data.current_weight || '',
        desired_weight: data.desired_weight || '',
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      age: Number(formData.age),
      height: Number(formData.height),
      current_weight: Number(formData.current_weight),
      desired_weight: Number(formData.desired_weight),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          type="number"
          id="age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="1"
          max="120"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="height" className="block text-sm font-medium text-gray-700">
          Height (cm)
        </label>
        <input
          type="number"
          id="height"
          value={formData.height}
          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="100"
          max="250"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="current_weight" className="block text-sm font-medium text-gray-700">
          Current Weight (kg)
        </label>
        <input
          type="number"
          id="current_weight"
          value={formData.current_weight}
          onChange={(e) => setFormData({ ...formData, current_weight: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="30"
          max="300"
          step="0.1"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="desired_weight" className="block text-sm font-medium text-gray-700">
          Desired Weight (kg)
        </label>
        <input
          type="number"
          id="desired_weight"
          value={formData.desired_weight}
          onChange={(e) => setFormData({ ...formData, desired_weight: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="30"
          max="300"
          step="0.1"
          required
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