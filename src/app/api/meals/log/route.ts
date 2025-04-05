import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logMeal } from '@/lib/supabase/meal-logs';
import { supabase } from '@/lib/supabase/client';
import { MealLog } from '@/types/database';

// Define the request schema
const mealLogSchema = z.object({
  meal_details: z.object({
    name: z.string(),
    ingredients: z.array(z.string()),
    portion_size: z.string()
  }),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fats: z.number().min(0),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack'])
});

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = mealLogSchema.parse(body);
    
    // Log the meal
    const mealLog = await logMeal(userId, validatedData);
    
    return NextResponse.json({
      status: 'success',
      message: 'Meal logged successfully',
      data: mealLog
    });
  } catch (error) {
    console.error('Error logging meal:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid meal data',
          errors: error.errors
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to log meal',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 