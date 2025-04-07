'use client';

import { useState, useEffect } from 'react';
import { OnboardingFormData } from '@/types/onboarding';

interface HealthInfoFormProps {
  onSubmit: (data: Partial<OnboardingFormData>) => void;
  data?: Partial<OnboardingFormData>;
  isLoading?: boolean;
}

export default function HealthInfoForm({ onSubmit, data, isLoading = false }: HealthInfoFormProps) {
  const [formData, setFormData] = useState({
    medical_conditions: data?.medical_conditions || '',
    additional_info: data?.additional_info || '',
  });

  // Update form data when data prop changes
  useEffect(() => {
    if (data) {
      setFormData({
        medical_conditions: data.medical_conditions || '',
        additional_info: data.additional_info || '',
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          placeholder="List any medical conditions, medications, or health concerns..."
          disabled={isLoading}
        />
        <p className="mt-2 text-sm text-gray-500">
          This information helps us ensure your diet plan is safe and appropriate for your health needs.
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          placeholder="Any other information you'd like us to know..."
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
            'Complete Onboarding'
          )}
        </button>
      </div>
    </form>
  );
} 