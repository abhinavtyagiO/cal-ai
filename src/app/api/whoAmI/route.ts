import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Fetch the user data from the database
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user data:', error);
      return NextResponse.json(
        { status: 'error', message: 'Failed to fetch user data' },
        { status: 500 }
      );
    }
    
    // Return the user data
    return NextResponse.json({
      status: 'success',
      data
    });
    
  } catch (error) {
    console.error('Error in whoAmI endpoint:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'An unexpected error occurred' 
      },
      { status: 500 }
    );
  }
} 