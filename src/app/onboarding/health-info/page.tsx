'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HealthInfoForm from '@/components/forms/HealthInfoForm';
import LoadingScreen from '@/components/ui/loading-screen';
import { Button } from '@/components/ui/button';
import { OnboardingFormData } from '@/types/onboarding';

export default function HealthInfoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousData, setPreviousData] = useState<Partial<OnboardingFormData> | undefined>(undefined);

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem('onboardingData');
    if (storedData) {
      setPreviousData(JSON.parse(storedData));
    }
  }, []);

  const handleSubmit = async (data: Partial<OnboardingFormData>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Save the health info data to localStorage
      const updatedData = { ...previousData, ...data };
      localStorage.setItem('onboardingData', JSON.stringify(updatedData));
      
      // First, complete the onboarding by saving user data
      const onboardingResponse = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!onboardingResponse.ok) {
        throw new Error('Failed to complete onboarding');
      }
      
      // Then generate the diet plan
      const dietPlanResponse = await fetch('/api/diet-plan/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!dietPlanResponse.ok) {
        throw new Error('Failed to generate diet plan');
      }
      
      // Clear onboarding data from localStorage
      localStorage.removeItem('onboardingData');
      
      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error during onboarding completion:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Generating your personalized diet plan..." />;
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Health Information</h1>
        <p className="text-gray-600">
          This is the final step of your onboarding. Please provide your health information to help us generate your personalized diet plan.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form id="health-info-form" onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data = Object.fromEntries(formData.entries());
          handleSubmit(data as Partial<OnboardingFormData>);
        }}>
          <HealthInfoForm 
            onSubmit={handleSubmit} 
            data={previousData}
            isLoading={isLoading}
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/onboarding/workout-details')}
              disabled={isLoading}
            >
              Back
            </Button>
            
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Complete Onboarding'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 