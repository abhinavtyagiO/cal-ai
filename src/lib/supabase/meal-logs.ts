import { supabase } from '@/lib/supabase/client';
import { MealLog } from '@/types/database';

/**
 * Logs a meal for a user
 */
export async function logMeal(userId: string, mealData: Omit<MealLog, 'id' | 'user_id' | 'logged_at'>) {
  const { data, error } = await supabase
    .from('meal_logs')
    .insert({
      user_id: userId,
      meal_details: mealData.meal_details,
      calories: mealData.calories,
      protein: mealData.protein,
      carbs: mealData.carbs,
      fats: mealData.fats,
      meal_type: mealData.meal_type
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error logging meal:', error);
    throw new Error(`Failed to log meal: ${error.message}`);
  }
  
  return data;
}

/**
 * Gets meal logs for a user for a specific date range
 */
export async function getMealLogs(userId: string, startDate: Date, endDate: Date) {
  const { data, error } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', startDate.toISOString())
    .lte('logged_at', endDate.toISOString())
    .order('logged_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching meal logs:', error);
    throw new Error(`Failed to fetch meal logs: ${error.message}`);
  }
  
  return data;
}

/**
 * Gets daily nutrition totals for a user for a specific date
 */
export async function getDailyNutrition(userId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const { data, error } = await supabase
    .from('meal_logs')
    .select('calories, protein, carbs, fats')
    .eq('user_id', userId)
    .gte('logged_at', startOfDay.toISOString())
    .lte('logged_at', endOfDay.toISOString());
  
  if (error) {
    console.error('Error fetching daily nutrition:', error);
    throw new Error(`Failed to fetch daily nutrition: ${error.message}`);
  }
  
  // Calculate totals
  const totals = data.reduce((acc: { calories: number; protein: number; carbs: number; fats: number }, meal: { calories: number | null; protein: number | null; carbs: number | null; fats: number | null }) => {
    return {
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fats: acc.fats + (meal.fats || 0)
    };
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  
  return totals;
}

/**
 * Deletes a meal log
 */
export async function deleteMealLog(mealLogId: string) {
  const { error } = await supabase
    .from('meal_logs')
    .delete()
    .eq('id', mealLogId);
  
  if (error) {
    console.error('Error deleting meal log:', error);
    throw new Error(`Failed to delete meal log: ${error.message}`);
  }
  
  return true;
} 