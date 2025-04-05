'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogMealsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [mealData, setMealData] = useState({
    meal_details: {
      name: '',
      ingredients: [''],
      portion_size: ''
    },
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    meal_type: 'breakfast'
  });
  
  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...mealData.meal_details.ingredients];
    newIngredients[index] = value;
    setMealData({
      ...mealData,
      meal_details: {
        ...mealData.meal_details,
        ingredients: newIngredients
      }
    });
  };
  
  const addIngredient = () => {
    setMealData({
      ...mealData,
      meal_details: {
        ...mealData.meal_details,
        ingredients: [...mealData.meal_details.ingredients, '']
      }
    });
  };
  
  const removeIngredient = (index: number) => {
    if (mealData.meal_details.ingredients.length > 1) {
      const newIngredients = [...mealData.meal_details.ingredients];
      newIngredients.splice(index, 1);
      setMealData({
        ...mealData,
        meal_details: {
          ...mealData.meal_details,
          ingredients: newIngredients
        }
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/meals/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mealData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to log meal');
      }
      
      setSuccess('Meal logged successfully!');
      
      // Reset form
      setMealData({
        meal_details: {
          name: '',
          ingredients: [''],
          portion_size: ''
        },
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        meal_type: 'breakfast'
      });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error logging meal:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Log a Meal</h1>
      
      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-bold">Success:</p>
          <p>{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Meal Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter the details of the meal you want to log.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="meal-name" className="block text-sm font-medium text-gray-700">
                    Meal Name
                  </label>
                  <input
                    type="text"
                    name="meal-name"
                    id="meal-name"
                    value={mealData.meal_details.name}
                    onChange={(e) => setMealData({
                      ...mealData,
                      meal_details: {
                        ...mealData.meal_details,
                        name: e.target.value
                      }
                    })}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="portion-size" className="block text-sm font-medium text-gray-700">
                    Portion Size
                  </label>
                  <input
                    type="text"
                    name="portion-size"
                    id="portion-size"
                    value={mealData.meal_details.portion_size}
                    onChange={(e) => setMealData({
                      ...mealData,
                      meal_details: {
                        ...mealData.meal_details,
                        portion_size: e.target.value
                      }
                    })}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Ingredients
                  </label>
                  <div className="mt-1 space-y-2">
                    {mealData.meal_details.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex">
                        <input
                          type="text"
                          value={ingredient}
                          onChange={(e) => handleIngredientChange(index, e.target.value)}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="Ingredient"
                        />
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Ingredient
                    </button>
                  </div>
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="meal-type" className="block text-sm font-medium text-gray-700">
                    Meal Type
                  </label>
                  <select
                    id="meal-type"
                    name="meal-type"
                    value={mealData.meal_type}
                    onChange={(e) => setMealData({
                      ...mealData,
                      meal_type: e.target.value as 'breakfast' | 'lunch' | 'dinner' | 'snack'
                    })}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
                    Calories
                  </label>
                  <input
                    type="number"
                    name="calories"
                    id="calories"
                    value={mealData.calories}
                    onChange={(e) => setMealData({
                      ...mealData,
                      calories: parseInt(e.target.value) || 0
                    })}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    min="0"
                    required
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="protein" className="block text-sm font-medium text-gray-700">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    name="protein"
                    id="protein"
                    value={mealData.protein}
                    onChange={(e) => setMealData({
                      ...mealData,
                      protein: parseInt(e.target.value) || 0
                    })}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    min="0"
                    required
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="carbs" className="block text-sm font-medium text-gray-700">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    name="carbs"
                    id="carbs"
                    value={mealData.carbs}
                    onChange={(e) => setMealData({
                      ...mealData,
                      carbs: parseInt(e.target.value) || 0
                    })}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    min="0"
                    required
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="fats" className="block text-sm font-medium text-gray-700">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    name="fats"
                    id="fats"
                    value={mealData.fats}
                    onChange={(e) => setMealData({
                      ...mealData,
                      fats: parseInt(e.target.value) || 0
                    })}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Logging...' : 'Log Meal'}
          </button>
        </div>
      </form>
    </div>
  );
} 