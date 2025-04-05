import { z } from 'zod';

// Define the response schema for the Deepseek API
const deepseekResponseSchema = z.object({
  meal_plan: z.object({
    breakfast: z.array(z.object({
      name: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fats: z.number(),
      ingredients: z.array(z.string()),
      instructions: z.string()
    })),
    lunch: z.array(z.object({
      name: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fats: z.number(),
      ingredients: z.array(z.string()),
      instructions: z.string()
    })),
    dinner: z.array(z.object({
      name: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fats: z.number(),
      ingredients: z.array(z.string()),
      instructions: z.string()
    })),
    snacks: z.array(z.object({
      name: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fats: z.number(),
      ingredients: z.array(z.string()),
      instructions: z.string()
    }))
  })
});

// Define the input parameters for the Deepseek API
interface GenerateMealPlanParams {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  duration: number;
  mealPreferences: 'vegetarian' | 'non-vegetarian';
  workoutFrequency: number;
  workoutSchedule: string[];
  cardioDetails?: string;
  medicalConditions?: string;
}

/**
 * Generates a personalized meal plan using the Deepseek API
 */
export async function generateMealPlan(params: GenerateMealPlanParams) {
  const {
    bmr,
    tdee,
    targetCalories,
    protein,
    carbs,
    fats,
    duration,
    mealPreferences,
    workoutFrequency,
    workoutSchedule,
    cardioDetails,
    medicalConditions
  } = params;

  // Check if the API key is available
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('Deepseek API key is not configured');
  }

  // Construct the prompt for the AI
  const prompt = `
    Generate a personalized meal plan with the following parameters:
    
    - BMR: ${bmr} calories
    - TDEE: ${tdee} calories
    - Target daily calories: ${targetCalories} calories
    - Macronutrient targets:
      - Protein: ${protein}g
      - Carbs: ${carbs}g
      - Fats: ${fats}g
    - Diet duration: ${duration} days
    - Meal preferences: ${mealPreferences}
    - Workout frequency: ${workoutFrequency} times per week
    - Workout schedule: ${workoutSchedule.join(', ')}
    ${cardioDetails ? `- Cardio details: ${cardioDetails}` : ''}
    ${medicalConditions ? `- Medical conditions: ${medicalConditions}` : ''}
    
    Please provide a meal plan with breakfast, lunch, dinner, and snacks options.
    Each meal should include:
    - Name
    - Calories
    - Protein, carbs, and fats content
    - Ingredients list
    - Preparation instructions
    
    Format the response as a JSON object with the following structure:
    {
      "meal_plan": {
        "breakfast": [...],
        "lunch": [...],
        "dinner": [...],
        "snacks": [...]
      }
    }
  `;

  try {
    // Call the Deepseek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Deepseek API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the JSON from the response
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Deepseek API response');
    }
    
    const jsonResponse = JSON.parse(jsonMatch[0]);
    
    // Validate the response against our schema
    return deepseekResponseSchema.parse(jsonResponse);
  } catch (error) {
    console.error('Error generating meal plan with Deepseek API:', error);
    throw error;
  }
} 