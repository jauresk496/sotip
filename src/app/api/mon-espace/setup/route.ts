import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Identifiant et mot de passe requis' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit faire au moins 8 caractères' }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 12);
    const upsert = (key: string, value: string) =>
      supabase.from('settings').upsert({ key, value }, { onConflict: 'key' });

    const { error: err1 } = await upsert('gestion_username', username);
    const { error: err2 } = await upsert('gestion_password_hash', hash);

    if (err1 || err2) {
      return NextResponse.json({ error: 'Erreur Supabase: ' + (err1 || err2)?.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Gestionnaire configuré avec succès.' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET() {
  const { data } = await supabase
    .from('settings')
    .select('key')
    .in('key', ['gestion_username', 'gestion_password_hash']);

  return NextResponse.json({ configured: !!(data && data.length >= 2) });
}
