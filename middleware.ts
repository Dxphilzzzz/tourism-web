// ============================================================
// TourEase — Middleware
// Protects dashboard/admin routes, refreshes auth session
// ============================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/business', '/admin'];

type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, any>;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);

            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ============================================================
  // Protected routes
  // ============================================================

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url);

    loginUrl.searchParams.set('next', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // ============================================================
  // Admin-only routes
  // ============================================================

  if (pathname.startsWith('/admin') && user) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.redirect(
          new URL('/dashboard', request.url)
        );
      }
    } catch (err) {
      console.error('Middleware profile check failed:', err);
      // Fallback: redirect to dashboard if profile check fails
      return NextResponse.redirect(
        new URL('/dashboard', request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/business/:path*',
    '/admin/:path*',
  ],
};