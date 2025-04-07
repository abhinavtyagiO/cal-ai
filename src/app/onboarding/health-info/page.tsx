'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HealthInfoForm from '@/components/forms/HealthInfoForm';
import { OnboardingFormData } from '@/types/onboarding';
import { completeOnboarding } from '@/utils/api';

export default function HealthInfoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousData, setPreviousData] = useState<Partial<OnboardingFormData>>({});

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem('onboardingData');
    if (storedData) {
      try {
        setPreviousData(JSON.parse(storedData));
      } catch (e) {
        console.error('Error parsing stored onboarding data:', e);
      }
    }
  }, []);

  const handleSubmit = async (data: Partial<OnboardingFormData>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Merge with previous data
      const mergedData = { ...previousData, ...data };
      
      // Save to database
      const result = await completeOnboarding(mergedData as OnboardingFormData);
      
      if (!result.success) {
        setError(result.message);
        setIsLoading(false);
        return;
      }
      
      // Clear onboarding data from localStorage
      localStorage.removeItem('onboardingData');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/onboarding/dietary-preferences');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Health Information
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Please provide any relevant health information to help us create a safe and effective diet plan.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium">
              This is the final step of your onboarding process. Click "Complete Onboarding" to finish and access your personalized dashboard.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-white shadow sm:rounded-lg p-6">
          <HealthInfoForm 
            onSubmit={handleSubmit}
            data={previousData}
            isLoading={isLoading}
          />
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dietary Preferences
          </button>
          <div className="text-sm text-gray-500">
            <p className="font-medium">Final Step (5 of 5)</p>
          </div>
        </div>
      </div>
    </div>
  );
} 