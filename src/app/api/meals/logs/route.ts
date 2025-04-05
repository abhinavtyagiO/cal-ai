import { NextRequest, NextResponse } from 'next/server';
import { getMealLogs, getDailyNutrition } from '@/lib/supabase/meal-logs';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
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
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const dateParam = searchParams.get('date');
    
    // If a specific date is provided, return daily nutrition
    if (dateParam) {
      const date = new Date(dateParam);
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { status: 'error', message: 'Invalid date format' },
          { status: 400 }
        );
      }
      
      const dailyNutrition = await getDailyNutrition(userId, date);
      
      return NextResponse.json({
        status: 'success',
        data: dailyNutrition
      });
    }
    
    // Otherwise, get meal logs for a date range
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Default to last 7 days
    
    let endDate = new Date();
    
    if (startDateParam) {
      const parsedStartDate = new Date(startDateParam);
      if (!isNaN(parsedStartDate.getTime())) {
        startDate = parsedStartDate;
      }
    }
    
    if (endDateParam) {
      const parsedEndDate = new Date(endDateParam);
      if (!isNaN(parsedEndDate.getTime())) {
        endDate = parsedEndDate;
      }
    }
    
    const mealLogs = await getMealLogs(userId, startDate, endDate);
    
    return NextResponse.json({
      status: 'success',
      data: mealLogs
    });
  } catch (error) {
    console.error('Error fetching meal logs:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch meal logs',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 