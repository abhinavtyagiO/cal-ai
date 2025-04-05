import { NextResponse } from 'next/server';
import { generateMealPlan } from '@/lib/ai/deepseek';

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

    // Call the Deepseek API
    const response = await generateMealPlan(testParams);

    return NextResponse.json({
      status: 'success',
      message: 'Deepseek API test successful',
      data: response
    });
  } catch (error) {
    console.error('Deepseek API test error:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to test Deepseek API',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 