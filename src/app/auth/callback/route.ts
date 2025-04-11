import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('Callback route hit');
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  
  console.log('Auth code:', code ? 'Present' : 'Not present');
  console.log('Error:', error);
  console.log('Error description:', errorDescription);
  console.log('Full URL:', requestUrl.toString());
  
  // If there's an error, redirect to signin with error message
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/auth/signin?error=${encodeURIComponent(errorDescription || 'Authentication failed')}`, requestUrl.origin)
    );
  }

  if (code) {
    try {
      console.log('Exchanging code for session...');
      // Create a response object that we can modify
      const response = NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
      
      // Create the Supabase client with the response object
      const supabase = createRouteHandlerClient({ cookies: () => cookies() });
      
      // Exchange the code for a session
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error('Session exchange error:', sessionError);
        throw sessionError;
      }
      
      console.log('Session obtained:', session ? 'Yes' : 'No');
      
      if (session) {
        console.log('Checking user onboarding status...');
        // Check if user has completed onboarding
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('User check error:', userError);
          throw userError;
        }

        console.log('User found:', user ? 'Yes' : 'No');
        
        // Redirect based on whether user has completed onboarding
        if (user) {
          console.log('Redirecting to dashboard...');
          return response;
        } else {
          console.log('Redirecting to onboarding...');
          return NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
        }
      }
    } catch (error) {
      console.error('Error in auth callback:', error);
      // Redirect to signin page if there's an error
      return NextResponse.redirect(
        new URL(`/auth/signin?error=${encodeURIComponent('Authentication failed. Please try again.')}`, requestUrl.origin)
      );
    }
  }

  console.log('No code present, redirecting to signin...');
  // Default redirect to signin if no code is present
  return NextResponse.redirect(
    new URL('/auth/signin?error=No authentication code received', requestUrl.origin)
  );
} 