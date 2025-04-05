'use client';

import { useState } from 'react';
import { OnboardingFormData } from '@/types/onboarding';
import BasicInfoForm from '@/components/forms/BasicInfoForm';
import BodyCompositionForm from '@/components/forms/BodyCompositionForm';
import WorkoutDetailsForm from '@/components/forms/WorkoutDetailsForm';
import DietaryPreferencesForm from '@/components/forms/DietaryPreferencesForm';
import HealthInfoForm from '@/components/forms/HealthInfoForm';

const STEPS = [
  { id: 'basic', title: 'Basic Information' },
  { id: 'body', title: 'Body Composition' },
  { id: 'workout', title: 'Workout Details' },
  { id: 'diet', title: 'Dietary Preferences' },
  { id: 'health', title: 'Health Information' },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>({});

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: Partial<OnboardingFormData>) => {
    setFormData({ ...formData, ...data });
    
    if (currentStep === STEPS.length - 1) {
      // TODO: Submit the complete form data to the backend
      console.log('Form submitted:', { ...formData, ...data });
    } else {
      handleNext();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoForm onSubmit={handleSubmit} data={formData} />;
      case 1:
        return <BodyCompositionForm onSubmit={handleSubmit} data={formData} />;
      case 2:
        return <WorkoutDetailsForm onSubmit={handleSubmit} data={formData} />;
      case 3:
        return <DietaryPreferencesForm onSubmit={handleSubmit} data={formData} />;
      case 4:
        return <HealthInfoForm onSubmit={handleSubmit} data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-24 h-1 mx-2 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {STEPS[currentStep].title}
            </h2>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg p-6">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-md ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
} 