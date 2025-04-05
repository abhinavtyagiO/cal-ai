import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Test the connection by querying the users table
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Supabase connection successful',
      data 
    });
  } catch (error) {
    console.error('Supabase connection error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to connect to Supabase',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 