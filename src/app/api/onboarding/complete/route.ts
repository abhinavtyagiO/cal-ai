import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { OnboardingFormData } from '@/types/onboarding';

// Validation schema for the onboarding data
const onboardingSchema = z.object({
  // Basic Information
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(1),
  height: z.number().positive(),
  current_weight: z.number().positive(),
  desired_weight: z.number().positive(),

  // Body Composition Goals
  current_body_fat: z.number().min(0).max(100),
  desired_body_fat: z.number().min(0).max(100),
  duration: z.number().positive(),

  // Workout Details
  workout_frequency: z.number().min(1).max(7),
  workout_schedule: z.array(z.string()),
  cardio_type: z.string().optional(),
  cardio_duration: z.number().optional(),
  cardio_intensity: z.string().optional(),

  // Dietary Preferences
  meal_preferences: z.enum(['vegetarian', 'non-vegetarian']),
  food_allergies: z.string().optional(),
  food_restrictions: z.string().optional(),

  // Health Information
  medical_conditions: z.string().optional(),
  additional_info: z.string().optional(),
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
    const body = await request.json();
    
    // Validate the request body
    const validatedData = onboardingSchema.parse(body);
    
    // Extract workout details into a separate object
    const workoutDetails = {
      workout_frequency: validatedData.workout_frequency,
      workout_schedule: validatedData.workout_schedule,
      cardio_type: validatedData.cardio_type,
      cardio_duration: validatedData.cardio_duration,
      cardio_intensity: validatedData.cardio_intensity,
    };
    
    // Remove workout fields from the main data object
    const { 
      workout_frequency, 
      workout_schedule, 
      cardio_type, 
      cardio_duration, 
      cardio_intensity,
      ...userData 
    } = validatedData;
    
    // Insert the user data with workout_details as JSONB
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: userId,
        email: session.user.email,
        ...userData,
        workout_details: workoutDetails
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error saving onboarding data:', error);
      return NextResponse.json(
        { status: 'error', message: 'Failed to save onboarding data' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Onboarding completed successfully',
      data
    });
    
  } catch (error) {
    console.error('Error in onboarding completion:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid onboarding data',
          errors: error.errors 
        },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'An unexpected error occurred' 
      },
      { status: 500 }
    );
  }
} 