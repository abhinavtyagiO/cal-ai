import { OnboardingFormData } from '@/types/onboarding';

/**
 * Fetches the authenticated user's information from the database
 * @returns The user's data or null if there was an error
 */
export async function fetchUserData(): Promise<OnboardingFormData | null> {
  try {
    const response = await fetch('/api/whoAmI');
    
    if (!response.ok) {
      console.error('Error fetching user data:', response.statusText);
      return null;
    }
    
    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      return result.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    return null;
  }
}

/**
 * Completes the onboarding process by saving the user's data to the database
 * @param data The onboarding form data
 * @returns The result of the API call
 */
export async function completeOnboarding(data: OnboardingFormData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/onboarding/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    return {
      success: result.status === 'success',
      message: result.message || 'Unknown error',
    };
  } catch (error) {
    console.error('Error in completeOnboarding:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
} 