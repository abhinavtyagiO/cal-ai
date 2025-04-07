export interface OnboardingFormData {
  // Basic Information
  name: string;
  age: number;
  height: number;
  current_weight: number;
  desired_weight: number;

  // Body Composition Goals
  current_body_fat: number;
  desired_body_fat: number;
  duration: number;

  // Workout Details
  workout_frequency: number;
  workout_schedule: string[];
  cardio_type?: string;
  cardio_duration?: number;
  cardio_intensity?: string;

  // Dietary Preferences
  meal_preferences: 'vegetarian' | 'non-vegetarian';
  food_allergies?: string;
  food_restrictions?: string;

  // Health Information
  medical_conditions?: string;
  additional_info?: string;
} 