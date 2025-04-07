'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { log } from 'console';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Check for error message in URL
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }

    // Check if user is already signed in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user has completed onboarding
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (user) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      }
    };

    checkUser();
  }, [router, searchParams, supabase]);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      console.log('Initiating Google sign-in...');
      
    //   // The callback URL must match what's registered in Google OAuth client
    //   const callbackUrl = 'https://uucjqkvkpkrzshkjjmfr.supabase.co/auth/v1/callback';
    //   // The redirect URL is where we want users to end up after auth
      const redirectUrl = `${window.location.origin}/auth/callback`;

      console.log('Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error);
        setError(error.message);
        throw error;
      }
      
      console.log('Sign-in initiated:', data);
      console.log('Auth URL:', data?.url);
      
      // If we have a URL, redirect to it
      if (data?.url) {
        console.log('Redirecting to Google auth page...');
        window.location.href = data.url;
      } else {
        console.error('No auth URL received from Supabase');
        setError('Failed to initiate Google sign-in. Please try again.');
      }
    } catch (error) {
      console.error('Error in Google sign-in:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Cal-AI
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your personal AI-powered fitness companion
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleSignIn}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
            </span>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
} 