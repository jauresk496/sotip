import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('settings')
    .select('key')
    .in('key', ['admin_username', 'admin_password_hash']);

  if (error) {
    return NextResponse.json({ configured: false, error: error.message });
  }

  const configured = data && data.length >= 2;
  return NextResponse.json({ configured });
}
