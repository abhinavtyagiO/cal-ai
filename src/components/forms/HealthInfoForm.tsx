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
    </form>
  );
} 