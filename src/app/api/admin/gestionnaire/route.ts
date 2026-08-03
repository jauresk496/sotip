import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

async function checkAuth() {
  const valid = await getSession();
  if (!valid) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  return null;
}

export async function GET() {
  const authErr = await checkAuth();
  if (authErr) return authErr;

  const { data } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['gestion_username', 'gestion_password_hash']);

  const username = data?.find(d => d.key === 'gestion_username')?.value || '';
  const hasPassword = !!data?.find(d => d.key === 'gestion_password_hash')?.value;

  return NextResponse.json({ username, configured: !!username && hasPassword });
}

export async function POST(request: Request) {
  const authErr = await checkAuth();
  if (authErr) return authErr;

  try {
    const { username, password } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Identifiant requis' }, { status: 400 });
    }

    const upsert = (key: string, value: string) =>
      supabase.from('settings').upsert({ key, value }, { onConflict: 'key' });

    const { error: err1 } = await upsert('gestion_username', username);

    if (err1) {
      return NextResponse.json({ error: 'Erreur: ' + err1.message }, { status: 500 });
    }

    if (password && password.length >= 8) {
      const hash = await bcrypt.hash(password, 12);
      const { error: err2 } = await upsert('gestion_password_hash', hash);
      if (err2) {
        return NextResponse.json({ error: 'Erreur: ' + err2.message }, { status: 500 });
      }
    } else if (password && password.length > 0) {
      return NextResponse.json({ error: 'Le mot de passe doit faire au moins 8 caractères' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Compte gestionnaire enregistré.' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur serveur' }, { status: 500 });
  }
}
