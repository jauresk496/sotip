import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  const valid = await getSession();
  if (!valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
