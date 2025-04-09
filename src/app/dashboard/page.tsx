'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface DietPlan {
  id: string;
  user_id: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  meal_plan: {
    [key: string]: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snacks: string[];
    };
  };
  shopping_list: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchDietPlan() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          router.push('/login');
          return;
        }
        
        const { data, error } = await supabase
          .from('diet_plans')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          throw error;
        }
        
        setDietPlan(data);
      } catch (err) {
        console.error('Error fetching diet plan:', err);
        setError('Failed to load your diet plan. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchDietPlan();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your diet plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!dietPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No diet plan found. Please complete the onboarding process.</p>
          <Button
            onClick={() => router.push('/onboarding/basic-information')}
            className="mt-4"
          >
            Start Onboarding
          </Button>
        </div>
      </div>
    );
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Personalized Diet Plan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Daily Targets</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Calories:</span> {dietPlan.macros.calories} kcal</p>
            <p><span className="font-medium">Protein:</span> {dietPlan.macros.protein}g</p>
            <p><span className="font-medium">Carbs:</span> {dietPlan.macros.carbs}g</p>
            <p><span className="font-medium">Fats:</span> {dietPlan.macros.fat}g</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Shopping List</h2>
          <ul className="list-disc list-inside space-y-1">
            {dietPlan.shopping_list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Weekly Meal Plan</h2>
        <div className="space-y-6">
          {days.map((day) => (
            <div key={day} className="border-b pb-4 last:border-b-0">
              <h3 className="text-lg font-medium capitalize mb-2">{day}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Breakfast</p>
                  <p className="text-gray-600">{dietPlan.meal_plan[day].breakfast}</p>
                </div>
                <div>
                  <p className="font-medium">Lunch</p>
                  <p className="text-gray-600">{dietPlan.meal_plan[day].lunch}</p>
                </div>
                <div>
                  <p className="font-medium">Dinner</p>
                  <p className="text-gray-600">{dietPlan.meal_plan[day].dinner}</p>
                </div>
                <div>
                  <p className="font-medium">Snacks</p>
                  <ul className="list-disc list-inside text-gray-600">
                    {dietPlan.meal_plan[day].snacks.map((snack, index) => (
                      <li key={index}>{snack}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 