import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Identifiant et mot de passe requis' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit faire au moins 8 caractères' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('settings')
      .select('key')
      .in('key', ['admin_username', 'admin_password_hash']);

    if (existing && existing.length >= 2) {
      return NextResponse.json({ error: 'Admin déjà configuré. Supprimez les clés admin_username et admin_password_hash de la table settings pour réinitialiser.' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const upsert = (key: string, value: string) =>
      supabase.from('settings').upsert({ key, value }, { onConflict: 'key' });

    const { error: err1 } = await upsert('admin_username', username);
    const { error: err2 } = await upsert('admin_password_hash', hash);

    if (err1 || err2) {
      return NextResponse.json({ error: 'Erreur Supabase: ' + (err1 || err2)?.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Admin configuré avec succès.' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur serveur' }, { status: 500 });
  }
}
