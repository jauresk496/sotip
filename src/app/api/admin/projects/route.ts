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
    .from('projects')
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
    const { slug, title, page_title, description, card_image, main_image, year, content, sidebar_title, sidebar_slug, sort_order } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: 'slug et title requis' }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      slug, title, page_title: page_title || '', description: description || '',
      year: year || '', content: content || [], sidebar_title: sidebar_title || '',
      sidebar_slug: sidebar_slug || slug, sort_order: sort_order ?? 0,
    };
    if (card_image !== undefined) payload.card_image = card_image;
    if (main_image !== undefined) payload.main_image = main_image;

    const { error } = await supabase.from('projects').upsert(payload, { onConflict: 'slug' });
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

  const { error } = await supabase.from('projects').delete().eq('slug', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
