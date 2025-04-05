'use client';

import { useState } from 'react';
import { OnboardingFormData } from '@/types/onboarding';

interface HealthInfoFormProps {
  onSubmit: (data: Partial<OnboardingFormData>) => void;
  data?: Partial<OnboardingFormData>;
}

export default function HealthInfoForm({ onSubmit, data }: HealthInfoFormProps) {
  const [formData, setFormData] = useState({
    medical_conditions: data?.medical_conditions || '',
    additional_info: data?.additional_info || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      medical_conditions: formData.medical_conditions || undefined,
      additional_info: formData.additional_info || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="medical_conditions" className="block text-sm font-medium text-gray-700">
          Medical Conditions
        </label>
        <textarea
          id="medical_conditions"
          value={formData.medical_conditions}
          onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="List any medical conditions that might affect your diet or exercise routine..."
        />
        <p className="mt-1 text-sm text-gray-500">
          This information will help us provide appropriate recommendations.
        </p>
      </div>

      <div>
        <label htmlFor="additional_info" className="block text-sm font-medium text-gray-700">
          Additional Information
        </label>
        <textarea
          id="additional_info"
          value={formData.additional_info}
          onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Any other information you'd like to share about your health, lifestyle, or goals..."
        />
        <p className="mt-1 text-sm text-gray-500">
          This is optional but can help us better personalize your experience.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Complete Setup
        </button>
      </div>
    </form>
  );
} 