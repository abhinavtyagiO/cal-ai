import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  console.log('Middleware hit for path:', path);

  // Skip middleware for auth-related paths and Supabase callback
  if (
    path.startsWith('/auth/') ||
    path.includes('supabase.co/auth/v1/callback')
  ) {
    console.log('Skipping middleware for auth route');
    return res;
  }

  // If user is not signed in and trying to access a protected route
  if (!session && !path.startsWith('/auth/')) {
    console.log('No session, redirecting to signin');
    const redirectUrl = new URL('/auth/signin', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is signed in
  if (session) {
    // Check if user has completed onboarding
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('id', session.user.id)
      .single();

    // If trying to access auth pages, redirect to dashboard
    if (path.startsWith('/auth/')) {
      console.log('Session present, redirecting to dashboard');
      const redirectUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // If trying to access onboarding pages but already completed onboarding
    if (path.startsWith('/onboarding') && user) {
      console.log('Onboarding completed, redirecting to dashboard');
      const redirectUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // If trying to access dashboard but haven't completed onboarding
    if (path.startsWith('/dashboard') && !user) {
      console.log('Onboarding not completed, redirecting to onboarding');
      const redirectUrl = new URL('/onboarding', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 