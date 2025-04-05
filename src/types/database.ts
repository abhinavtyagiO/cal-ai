export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  height: number;
  current_weight: number;
  desired_weight: number;
  current_body_fat: number;
  desired_body_fat: number;
  duration: number;
  workout_details: WorkoutDetails;
  meal_preferences: 'vegetarian' | 'non-vegetarian';
  medical_conditions?: string;
  additional_info?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutDetails {
  frequency: number;
  schedule: string[];
  cardio_details?: {
    type: string;
    duration: number;
    intensity: string;
  };
}

export interface DietPlan {
  id: string;
  user_id: string;
  daily_calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_plan: MealPlan;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MealPlan {
  breakfast: MealOption[];
  lunch: MealOption[];
  dinner: MealOption[];
  snacks: MealOption[];
}

export interface MealOption {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string[];
}

export interface MealLog {
  id: string;
  user_id: string;
  meal_details: {
    name: string;
    ingredients: string[];
    portion_size: string;
  };
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  logged_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  weight: number;
  body_fat: number;
  measurement_date: string;
} 