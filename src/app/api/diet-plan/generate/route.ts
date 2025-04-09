import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { OnboardingFormData } from '@/types/onboarding';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Get the user data from the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json(
        { status: 'error', message: 'Failed to fetch user data' },
        { status: 500 }
      );
    }
    
    // Generate the diet plan using OpenAI
    const dietPlan = await generateDietPlan(userData);
    
    // Save the diet plan to the database
    const { data: savedPlan, error: saveError } = await supabase
      .from('diet_plans')
      .insert([{
        user_id: userId,
        macros: {
          calories: dietPlan.daily_calories,
          protein: dietPlan.macronutrients.protein,
          carbs: dietPlan.macronutrients.carbs,
          fat: dietPlan.macronutrients.fat
        },
        meal_plan: dietPlan.meal_plan,
        shopping_list: dietPlan.shopping_list,
        is_active: true
      }])
      .select()
      .single();
    
    if (saveError) {
      console.error('Error saving diet plan:', saveError);
      return NextResponse.json(
        { status: 'error', message: 'Failed to save diet plan' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Diet plan generated successfully',
      data: savedPlan
    });
    
  } catch (error) {
    console.error('Error generating diet plan:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'An unexpected error occurred' 
      },
      { status: 500 }
    );
  }
}

async function generateDietPlan(userData: any) {
  // Extract workout details from JSONB
  const workoutDetails = userData.workout_details || {};
  
  // Create a prompt for OpenAI
  const prompt = `
    Create a personalized weekly diet plan for a ${userData.gender || 'person'} with the following characteristics:
    
    Basic Information:
    - Age: ${userData.age} years
    - Height: ${userData.height} cm
    - Current Weight: ${userData.current_weight} kg
    - Desired Weight: ${userData.desired_weight} kg
    
    Body Composition Goals:
    - Current Body Fat: ${userData.current_body_fat}%
    - Desired Body Fat: ${userData.desired_body_fat}%
    - Duration of Diet Plan: ${userData.duration} weeks
    
    Workout Details:
    - Workout Frequency: ${workoutDetails.workout_frequency || 'Not specified'} times per week
    - Workout Schedule: ${workoutDetails.workout_schedule ? workoutDetails.workout_schedule.join(', ') : 'Not specified'}
    - Cardio Type: ${workoutDetails.cardio_type || 'Not specified'}
    - Cardio Duration: ${workoutDetails.cardio_duration || 'Not specified'} minutes
    - Cardio Intensity: ${workoutDetails.cardio_intensity || 'Not specified'}
    
    Dietary Preferences:
    - Meal Preferences: ${userData.meal_preferences}
    - Food Allergies: ${userData.food_allergies || 'None'}
    - Food Restrictions: ${userData.food_restrictions || 'None'}
    
    Health Information:
    - Medical Conditions: ${userData.medical_conditions || 'None'}
    - Additional Information: ${userData.additional_info || 'None'}
    
    Please provide a detailed weekly meal plan with the following structure:
    1. Calculate the appropriate daily calorie intake based on the user's goals
    2. Determine the optimal macronutrient breakdown (protein, carbs, fats)
    3. Create a 7-day meal plan with breakfast, lunch, dinner, and snacks
    4. Include portion sizes and approximate calorie counts for each meal
    5. Provide a shopping list for the week
    
    Format the response as a JSON object with the following structure:
    {
      "daily_calories": number,
      "macronutrients": {
        "protein": number,
        "carbs": number,
        "fat": number
      },
      "meal_plan": {
        "monday": {
          "breakfast": string,
          "lunch": string,
          "dinner": string,
          "snacks": string[]
        },
        "tuesday": { ... },
        "wednesday": { ... },
        "thursday": { ... },
        "friday": { ... },
        "saturday": { ... },
        "sunday": { ... }
      },
      "shopping_list": string[]
    }
  `;
  
  // Call OpenAI API
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a professional nutritionist and dietitian specializing in creating personalized meal plans. Your task is to create a detailed, practical, and healthy meal plan based on the user's information. Ensure the plan is realistic, varied, and aligned with the user's goals and preferences."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });
  
  // Parse the response
  const dietPlanJson = JSON.parse(response.choices[0].message.content || '{}');
  
  return dietPlanJson;
} 