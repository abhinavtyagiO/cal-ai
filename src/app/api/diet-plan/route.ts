import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get the user's diet plan
    const { data: dietPlan, error: dietPlanError } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (dietPlanError) {
      console.error('Error fetching diet plan:', dietPlanError);
      return NextResponse.json(
        { error: 'Failed to fetch diet plan' },
        { status: 500 }
      );
    }
    
    if (!dietPlan) {
      return NextResponse.json(
        { error: 'No diet plan found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(dietPlan);
  } catch (error) {
    console.error('Error in diet plan API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 