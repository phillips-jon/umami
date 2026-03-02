export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = new URL(request.url);
  url.pathname = `/${slug}`;
  return NextResponse.redirect(url.toString(), 301);
}
