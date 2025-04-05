import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateMealPlan } from '@/lib/ai/openai';

// Validation schema for the request
const generateDietPlanSchema = z.object({
  userId: z.string().uuid(),
});

// Calculate BMR using Mifflin-St Jeor Equation
function calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female'): number {
  const bmr = (10 * weight) + (6.25 * height) - (5 * age);
  return gender === 'male' ? bmr + 5 : bmr - 161;
}

// Calculate TDEE (Total Daily Energy Expenditure)
function calculateTDEE(bmr: number, activityLevel: number): number {
  return bmr * activityLevel;
}

// Calculate macros based on goals
function calculateMacros(tdee: number, currentWeight: number, desiredWeight: number, duration: number): {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
} {
  // Calculate weight change per week
  const totalWeightChange = desiredWeight - currentWeight;
  const weeklyWeightChange = totalWeightChange / (duration / 7);
  
  // Adjust calories based on weight change goal
  // 1 kg of fat = 7700 calories
  const calorieAdjustment = weeklyWeightChange * 7700 / 7;
  const targetCalories = tdee + calorieAdjustment;

  // Calculate macros
  const protein = currentWeight * 2.2; // 2.2g per kg of body weight
  const fats = (targetCalories * 0.25) / 9; // 25% of calories from fat
  const carbs = (targetCalories - (protein * 4 + fats * 9)) / 4; // Remaining calories from carbs

  return {
    calories: Math.round(targetCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats),
  };
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

    // Validate the request body
    const { userId } = generateDietPlanSchema.parse(body);

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      throw userError;
    }

    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate BMR and TDEE
    const bmr = calculateBMR(user.current_weight, user.height, user.age, 'male'); // Default to male for now
    const activityLevel = 1.55; // Moderate activity level (can be adjusted based on workout frequency)
    const tdee = calculateTDEE(bmr, activityLevel);

    // Calculate macros
    const macros = calculateMacros(
      tdee,
      user.current_weight,
      user.desired_weight,
      user.duration
    );

    // Parse workout details
    const workoutDetails = user.workout_details as {
      frequency: number;
      schedule: string[];
      cardio_details?: string;
    };

    // Generate meal plan using OpenAI API
    let mealPlan;
    try {
      const openaiResponse = await generateMealPlan({
        bmr,
        tdee,
        targetCalories: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fats: macros.fats,
        duration: user.duration,
        mealPreferences: user.meal_preferences,
        workoutFrequency: workoutDetails.frequency,
        workoutSchedule: workoutDetails.schedule,
        cardioDetails: workoutDetails.cardio_details,
        medicalConditions: user.medical_conditions || undefined
      });
      
      mealPlan = openaiResponse.meal_plan;
    } catch (error) {
      console.error('Error generating meal plan with OpenAI API:', error);
      
      // Fallback to a default meal plan if the API call fails
      mealPlan = {
        breakfast: [
          {
            name: 'Oatmeal with Protein',
            calories: 400,
            protein: 20,
            carbs: 60,
            fats: 10,
            ingredients: ['1 cup oats', '1 scoop protein powder', '1 banana', '1 tbsp honey'],
            instructions: 'Cook oats with water, stir in protein powder, top with banana and honey'
          }
        ],
        lunch: [
          {
            name: 'Chicken Salad',
            calories: 500,
            protein: 40,
            carbs: 30,
            fats: 20,
            ingredients: ['200g chicken breast', 'Mixed greens', 'Olive oil', 'Balsamic vinegar'],
            instructions: 'Grill chicken, chop and mix with greens, dress with olive oil and vinegar'
          }
        ],
        dinner: [
          {
            name: 'Salmon with Vegetables',
            calories: 600,
            protein: 45,
            carbs: 40,
            fats: 25,
            ingredients: ['200g salmon', 'Brown rice', 'Mixed vegetables', 'Olive oil'],
            instructions: 'Bake salmon, cook rice, steam vegetables, combine and serve'
          }
        ],
        snacks: [
          {
            name: 'Greek Yogurt with Nuts',
            calories: 200,
            protein: 15,
            carbs: 20,
            fats: 8,
            ingredients: ['1 cup Greek yogurt', 'Mixed nuts', 'Honey'],
            instructions: 'Top yogurt with nuts and drizzle honey'
          }
        ]
      };
    }

    // Insert the diet plan
    const { data: dietPlan, error: dietPlanError } = await supabase
      .from('diet_plans')
      .insert([{
        user_id: userId,
        daily_calories: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fats: macros.fats,
        meal_plan: mealPlan,
        is_active: true
      }])
      .select()
      .single();

    if (dietPlanError) {
      throw dietPlanError;
    }

    return NextResponse.json({
      status: 'success',
      message: 'Diet plan generated successfully',
      data: dietPlan
    });

  } catch (error) {
    console.error('Diet plan generation error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid input data',
          errors: error.errors 
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to generate diet plan',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 