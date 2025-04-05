'use client';

import { useState } from 'react';
import { OnboardingFormData } from '@/types/onboarding';

interface BodyCompositionFormProps {
  onSubmit: (data: Partial<OnboardingFormData>) => void;
  data?: Partial<OnboardingFormData>;
}

export default function BodyCompositionForm({ onSubmit, data }: BodyCompositionFormProps) {
  const [formData, setFormData] = useState({
    current_body_fat: data?.current_body_fat || '',
    desired_body_fat: data?.desired_body_fat || '',
    duration: data?.duration || '',
  });

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
        <label htmlFor="current_body_fat" className="block text-sm font-medium text-gray-700">
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
        />
        <p className="mt-1 text-sm text-gray-500">
          If you're not sure, you can estimate or use a body fat calculator
        </p>
      </div>

      <div>
        <label htmlFor="desired_body_fat" className="block text-sm font-medium text-gray-700">
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
        />
        <p className="mt-1 text-sm text-gray-500">
          Typical ranges: Men 10-20%, Women 18-28%
        </p>
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
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
        />
        <p className="mt-1 text-sm text-gray-500">
          How long would you like to follow this diet plan?
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