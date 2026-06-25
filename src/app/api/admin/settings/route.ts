import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

async function checkAuth() {
  const valid = await getSession();
  if (!valid) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  return null;
}

export async function GET() {
  const authError = await checkAuth();
  if (authError) return authError;

  const { data, error } = await supabase.from('settings').select('key, value');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings: Record<string, string> = {};
  (data || []).forEach((row: { key: string; value: string }) => {
    settings[row.key] = row.value;
  });

  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const promises = Object.entries(body).map(([key, value]) =>
      supabase.from('settings').upsert({ key, value: String(value) }, { onConflict: 'key' })
    );

    await Promise.all(promises);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
}
