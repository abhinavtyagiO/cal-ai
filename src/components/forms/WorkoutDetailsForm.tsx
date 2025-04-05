'use client';

import { useState } from 'react';
import { OnboardingFormData } from '@/types/onboarding';

interface WorkoutDetailsFormProps {
  onSubmit: (data: Partial<OnboardingFormData>) => void;
  data?: Partial<OnboardingFormData>;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const CARDIO_TYPES = [
  'Running',
  'Cycling',
  'Swimming',
  'Walking',
  'HIIT',
  'Other',
];

const INTENSITY_LEVELS = ['Low', 'Medium', 'High'];

export default function WorkoutDetailsForm({ onSubmit, data }: WorkoutDetailsFormProps) {
  const [formData, setFormData] = useState({
    workout_frequency: data?.workout_frequency || '',
    workout_schedule: data?.workout_schedule || [],
    cardio_type: data?.cardio_type || '',
    cardio_duration: data?.cardio_duration || '',
    cardio_intensity: data?.cardio_intensity || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      workout_frequency: Number(formData.workout_frequency),
      workout_schedule: formData.workout_schedule,
      cardio_type: formData.cardio_type,
      cardio_duration: formData.cardio_duration ? Number(formData.cardio_duration) : undefined,
      cardio_intensity: formData.cardio_intensity,
    });
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      workout_schedule: prev.workout_schedule.includes(day)
        ? prev.workout_schedule.filter(d => d !== day)
        : [...prev.workout_schedule, day],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="workout_frequency" className="block text-sm font-medium text-gray-700">
          How many times do you exercise per week?
        </label>
        <input
          type="number"
          id="workout_frequency"
          value={formData.workout_frequency}
          onChange={(e) => setFormData({ ...formData, workout_frequency: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="0"
          max="7"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Which days do you typically exercise?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                formData.workout_schedule.includes(day)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="cardio_type" className="block text-sm font-medium text-gray-700">
          Preferred Cardio Type
        </label>
        <select
          id="cardio_type"
          value={formData.cardio_type}
          onChange={(e) => setFormData({ ...formData, cardio_type: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a cardio type</option>
          {CARDIO_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {formData.cardio_type && (
        <>
          <div>
            <label htmlFor="cardio_duration" className="block text-sm font-medium text-gray-700">
              Typical Cardio Duration (minutes)
            </label>
            <input
              type="number"
              id="cardio_duration"
              value={formData.cardio_duration}
              onChange={(e) => setFormData({ ...formData, cardio_duration: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="5"
              max="180"
              step="5"
            />
          </div>

          <div>
            <label htmlFor="cardio_intensity" className="block text-sm font-medium text-gray-700">
              Cardio Intensity
            </label>
            <select
              id="cardio_intensity"
              value={formData.cardio_intensity}
              onChange={(e) => setFormData({ ...formData, cardio_intensity: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select intensity</option>
              {INTENSITY_LEVELS.map((intensity) => (
                <option key={intensity} value={intensity}>
                  {intensity}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

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