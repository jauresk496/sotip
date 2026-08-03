import { NextResponse } from 'next/server';
import { clearGestionSession } from '@/lib/auth';

export async function POST() {
  await clearGestionSession();
  return NextResponse.json({ success: true });
}
