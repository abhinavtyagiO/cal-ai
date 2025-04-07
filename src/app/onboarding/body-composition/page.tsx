'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BodyCompositionForm from '@/components/forms/BodyCompositionForm';
import { OnboardingFormData } from '@/types/onboarding';

export default function BodyCompositionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previousData, setPreviousData] = useState<Partial<OnboardingFormData>>({});

  useEffect(() => {
    // Retrieve the data from the previous step
    const storedData = localStorage.getItem('onboardingData');
    if (storedData) {
      setPreviousData(JSON.parse(storedData));
    }
  }, []);

  const handleSubmit = async (data: Partial<OnboardingFormData>) => {
    setIsLoading(true);
    
    try {
      // Merge the new data with the previous data
      const mergedData = { ...previousData, ...data };
      localStorage.setItem('onboardingData', JSON.stringify(mergedData));
      
      // Redirect to the next step
      router.push('/onboarding/workout-details');
    } catch (error) {
      console.error('Error saving form data:', error);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/onboarding/basic-information');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Body Composition
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Let's understand your current body composition
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <BodyCompositionForm 
            onSubmit={handleSubmit} 
            data={previousData}
            isLoading={isLoading}
          />
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Basic Information
          </button>
          <div className="text-sm text-gray-500">
            Step 2 of 5
          </div>
        </div>
      </div>
    </div>
  );
} 