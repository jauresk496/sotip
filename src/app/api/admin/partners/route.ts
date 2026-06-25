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

  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { slug, image, name, sort_order } = body;

    if (!slug || !name) {
      return NextResponse.json({ error: 'slug et name requis' }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      slug, name, image: image || '', sort_order: sort_order ?? 0,
    };

    const { error } = await supabase.from('partners').upsert(payload, { onConflict: 'slug' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug requis' }, { status: 400 });

  const { error } = await supabase.from('partners').delete().eq('slug', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
