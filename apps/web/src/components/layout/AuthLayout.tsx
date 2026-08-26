'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { Loader2, Moon } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthLayout({
  children,
  fallback,
  redirectTo = '/auth/login',
}: AuthLayoutProps) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (session) {
        setAuthorized(true);
      } else {
        router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [session, loading, router, pathname, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center space-y-4">
          <Moon className="h-12 w-12 text-accent-gold mx-auto" aria-hidden="true" />
          <Loader2 className="h-8 w-8 animate-spin text-accent-gold mx-auto" aria-hidden="true" />
          <p className="text-body-sm text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return fallback ?? null;
  }

  return <>{children}</>;
}