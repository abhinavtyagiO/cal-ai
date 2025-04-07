'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BasicInfoForm from '@/components/forms/BasicInfoForm';
import { OnboardingFormData } from '@/types/onboarding';

export default function BasicInformationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previousData, setPreviousData] = useState<Partial<OnboardingFormData>>({});

  useEffect(() => {
    // Retrieve the data from localStorage if it exists
    const storedData = localStorage.getItem('onboardingData');
    if (storedData) {
      setPreviousData(JSON.parse(storedData));
    }
  }, []);

  const handleSubmit = async (data: Partial<OnboardingFormData>) => {
    setIsLoading(true);
    
    try {
      // Store the form data in localStorage for now
      // In a real app, you might want to use a state management solution or context
      localStorage.setItem('onboardingData', JSON.stringify(data));
      
      // Redirect to the next step
      router.push('/onboarding/body-composition');
    } catch (error) {
      console.error('Error saving form data:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Basic Information
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Let's start with some basic details about you
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <BasicInfoForm 
            onSubmit={handleSubmit} 
            data={previousData}
            isLoading={isLoading}
          />
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Step 1 of 5</p>
        </div>
      </div>
    </div>
  );
} 