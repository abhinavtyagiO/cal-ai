'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnboardingLandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartOnboarding = () => {
    setIsLoading(true);
    router.push('/onboarding/basic-information');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome to Cal-AI!
          </h1>
          <p className="mt-3 text-xl text-gray-700 sm:mt-4">
            Your personal AI-powered fitness companion
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image
                    src="/images/onboarding-illustration.svg"
                    alt="Fitness tracking illustration"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Let's personalize your experience
                </h2>
                
                <div className="space-y-4 text-gray-700 mb-8">
                  <p>
                    To create your personalized diet and fitness plan, we need to gather some information about you.
                    This will help us understand your goals and preferences better.
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">What we'll ask you:</h3>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Basic information (age, height, weight)</li>
                      <li>Fitness goals and preferences</li>
                      <li>Dietary restrictions and preferences</li>
                      <li>Activity level and workout schedule</li>
                    </ul>
                  </div>
                  
                  <p className="text-sm text-gray-700">
                    Don't worry, you can always update this information later in your profile settings.
                  </p>
                </div>
                
                <button
                  onClick={handleStartOnboarding}
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Starting onboarding...
                    </span>
                  ) : (
                    'Start Onboarding'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-700">
          <p>This process will take about 5-10 minutes to complete.</p>
        </div>
      </div>
    </div>
  );
} 