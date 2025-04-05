import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PostgrestError } from '@supabase/supabase-js';

// Validation schema for the registration request
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(1),
  height: z.number().positive(),
  current_weight: z.number().positive(),
  desired_weight: z.number().positive(),
  current_body_fat: z.number().min(0).max(100),
  desired_body_fat: z.number().min(0).max(100),
  duration: z.number().positive(),
  workout_details: z.object({
    frequency: z.number().min(1).max(7),
    schedule: z.array(z.string()),
    cardio_details: z.string().optional(),
  }),
  meal_preferences: z.enum(['vegetarian', 'non-vegetarian']),
  medical_conditions: z.string().optional(),
  additional_info: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

    // Validate the request body
    const validatedData = registerSchema.parse(body);

    // Insert the user data
    const { data, error } = await supabase
      .from('users')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation
      if ((error as PostgrestError).code === '23505') {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'Email already exists' 
          },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      status: 'success',
      message: 'User registered successfully',
      data
    });

  } catch (error) {
    console.error('Registration error:', error);
    
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
        message: 'Failed to register user',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 