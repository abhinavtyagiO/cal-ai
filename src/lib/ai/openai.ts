import { z } from 'zod';
import { OpenAI } from 'openai';
import { handleOpenAIError } from './error-handling';

// Define the response schema for the OpenAI API
const responseSchema = z.object({
  meal_plan: z.object({
    breakfast: z.array(z.object({
      name: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fats: z.number(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string())
    })),
    lunch: z.array(z.object({
      name: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fats: z.number(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string())
    })),
    dinner: z.array(z.object({
      name: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fats: z.number(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string())
    })),
    snacks: z.array(z.object({
      name: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fats: z.number(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string())
    }))
  })
});

export interface GenerateMealPlanParams {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  duration: number;
  mealPreferences: 'vegetarian' | 'non-vegetarian' | 'vegan';
  workoutFrequency: number;
  workoutSchedule: string[];
  cardioDetails?: string;
  medicalConditions?: string;
}

/**
 * Constructs a prompt for the OpenAI API based on the user's parameters
 */
function constructPrompt(params: GenerateMealPlanParams): string {
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

  return `
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
    
    IMPORTANT: Your response must be a valid JSON object with the following structure:
    {
      "meal_plan": {
        "breakfast": [
          {
            "name": "Meal name",
            "calories": 500,
            "protein": 30,
            "carbs": 50,
            "fats": 20,
            "ingredients": ["ingredient 1", "ingredient 2"],
            "instructions": ["step 1", "step 2"]
          }
        ],
        "lunch": [...],
        "dinner": [...],
        "snacks": [...]
      }
    }
    
    Do not include any text outside of the JSON object. The response must be parseable as JSON.
  `;
}

/**
 * Generates a personalized meal plan using the OpenAI API
 */
export async function generateMealPlan(params: GenerateMealPlanParams) {
  const prompt = constructPrompt(params);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a nutritionist and meal planning expert. Generate detailed meal plans based on the user\'s requirements. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI API');
    }

    let jsonContent;
    try {
      jsonContent = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', content);
      
      // Try to extract JSON from the response if it's not valid JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          jsonContent = JSON.parse(jsonMatch[0]);
          console.log('Successfully extracted JSON from response');
        } catch (extractError) {
          throw new Error(`Failed to parse OpenAI response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
      } else {
        throw new Error(`Failed to parse OpenAI response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
    }

    try {
      return responseSchema.parse(jsonContent);
    } catch (validationError) {
      console.error('OpenAI response validation failed:', jsonContent);
      throw new Error(`OpenAI response validation failed: ${validationError instanceof Error ? validationError.message : 'Unknown error'}`);
    }
  } catch (error) {
    throw new Error(handleOpenAIError(error));
  }
} 