import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { cookies } from 'next/headers';

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export async function GET() {
  try {
    const cookieStore = cookies();
    
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Test meal data
    const testMeal = {
      user_id: session.user.id,
      meal_details: {
        name: 'Test Meal',
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        portion_size: '1 serving'
      },
      calories: 500,
      protein: 30,
      carbs: 50,
      fats: 20,
      meal_type: 'lunch'
    };
    
    // Insert test meal
    const { data, error } = await supabase
      .from('meal_logs')
      .insert(testMeal)
      .select()
      .single();
    
    if (error) {
      console.error('Error logging test meal:', error);
      return NextResponse.json(
        { error: 'Failed to log test meal' },
        { status: 500 }
      );
    }
    
    // Get today's nutrition totals
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: nutritionData, error: nutritionError } = await supabase
      .from('meal_logs')
      .select('calories, protein, carbs, fats')
      .eq('user_id', session.user.id)
      .gte('logged_at', today.toISOString())
      .lte('logged_at', new Date().toISOString());
    
    if (nutritionError) {
      console.error('Error fetching nutrition data:', nutritionError);
      return NextResponse.json(
        { error: 'Failed to fetch nutrition data' },
        { status: 500 }
      );
    }
    
    // Calculate totals
    const totals = nutritionData.reduce((acc: NutritionData, meal: NutritionData) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
    
    return NextResponse.json({
      message: 'Test meal logged successfully',
      meal: data,
      dailyTotals: totals
    });
  } catch (error) {
    console.error('Error in test meal log endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 