'use client';

import { ReactNode } from 'react';
import { useSessionTimeout } from '@/lib/auth/session-timeout';
import { getSessionTimeoutMs } from '@/lib/auth/session-config';

interface SessionTimeoutProviderProps {
  children: ReactNode;
  timeoutMs?: number;
}

/**
 * Provider component that handles session timeout for the application
 * This should be placed at the root of the application
 */
export default function SessionTimeoutProvider({
  children,
  timeoutMs = getSessionTimeoutMs(),
}: SessionTimeoutProviderProps) {
  // Use the session timeout hook
  useSessionTimeout(timeoutMs);

  return <>{children}</>;
} 