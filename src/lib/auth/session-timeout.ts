import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Default timeout in milliseconds (30 minutes)
const DEFAULT_TIMEOUT = 30 * 60 * 1000;

// Events to reset the timer
const RESET_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
];

/**
 * Sets up session timeout monitoring
 * @param timeoutMs Timeout in milliseconds (default: 30 minutes)
 * @param onTimeout Callback function to execute when timeout occurs
 */
export function setupSessionTimeout(
  timeoutMs: number = DEFAULT_TIMEOUT,
  onTimeout?: () => void
): () => void {
  let timeoutId: NodeJS.Timeout;
  
  // Function to reset the timer
  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      // Execute the timeout callback if provided
      if (onTimeout) {
        onTimeout();
      }
    }, timeoutMs);
  };
  
  // Set up event listeners to reset the timer
  RESET_EVENTS.forEach(event => {
    window.addEventListener(event, resetTimer);
  });
  
  // Initialize the timer
  resetTimer();
  
  // Return cleanup function
  return () => {
    clearTimeout(timeoutId);
    RESET_EVENTS.forEach(event => {
      window.removeEventListener(event, resetTimer);
    });
  };
}

/**
 * Hook to handle session timeout with automatic logout
 * @param timeoutMs Timeout in milliseconds (default: 30 minutes)
 */
export function useSessionTimeout(timeoutMs: number = DEFAULT_TIMEOUT) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  // Set up the timeout when the component mounts
  useEffect(() => {
    const handleTimeout = async () => {
      // Sign out the user
      await supabase.auth.signOut();
      
      // Redirect to signin page
      router.push('/auth/signin?message=session_expired');
    };
    
    const cleanup = setupSessionTimeout(timeoutMs, handleTimeout);
    
    // Clean up when the component unmounts
    return cleanup;
  }, [timeoutMs, router, supabase]);
} 