import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect the dashboard — login page is public
  if (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/api/admin/items') || pathname.startsWith('/api/admin/sets')) {
    const token = req.cookies.get('admin_token')?.value;
    const secret = process.env.ADMIN_SECRET;

    if (!secret || token !== secret) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/api/admin/items/:path*', '/api/admin/sets/:path*'],
};
