import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isPublicPage = request.nextUrl.pathname === '/';

  // Kullanıcı giriş yapmışsa ve auth sayfalarına erişmeye çalışıyorsa
  if (token && (isAuthPage || isPublicPage)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Kullanıcı giriş yapmamışsa ve korumalı sayfalara erişmeye çalışıyorsa
  if (!token && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

// Middleware'in çalışacağı path'leri belirt
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /static (public files)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml (public files)
     */
    '/((?!api|_next|static|_vercel|favicon.ico|sitemap.xml).*)',
  ],
}; 