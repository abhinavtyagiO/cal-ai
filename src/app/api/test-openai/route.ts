import { NextResponse } from 'next/server';
import { generateMealPlan } from '@/lib/ai/openai';

export async function GET() {
  try {
    // Test parameters
    const testParams = {
      bmr: 1800,
      tdee: 2200,
      targetCalories: 2000,
      protein: 150,
      carbs: 200,
      fats: 70,
      duration: 30,
      mealPreferences: 'non-vegetarian' as const,
      workoutFrequency: 3,
      workoutSchedule: ['Monday', 'Wednesday', 'Friday'],
      cardioDetails: '30 minutes running',
      medicalConditions: 'None'
    };

    // Call the OpenAI API
    const response = await generateMealPlan(testParams);

    return NextResponse.json({
      status: 'success',
      message: 'OpenAI API test successful',
      data: response
    });
  } catch (error) {
    console.error('OpenAI API test error:', error);
    
    // Extract more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to test OpenAI API',
        error: errorMessage,
        stack: errorStack
      },
      { status: 500 }
    );
  }
} 