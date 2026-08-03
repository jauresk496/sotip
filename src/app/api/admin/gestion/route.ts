import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

async function checkAuth() {
  const valid = await getSession();
  if (!valid) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  return null;
}

const PREFIX: Record<string, string> = {
  bon_caisse: 'BC',
  recu: 'REC',
  bon_sortie: 'BS',
};

export async function GET(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const docType = searchParams.get('doc_type');
  const id = searchParams.get('id');

  if (id) {
    const { data, error } = await supabase
      .from('gestion_documents')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  }

  let query = supabase
    .from('gestion_documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (docType) query = query.eq('doc_type', docType);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, doc_type, data, status } = body;

    if (!doc_type || !data) {
      return NextResponse.json({ error: 'doc_type et data requis' }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      doc_type,
      data,
      status: status || 'valide',
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await supabase.from('gestion_documents').update(payload).eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, id });
    }

    const year = new Date().getFullYear();
    const prefix = PREFIX[doc_type] || 'DOC';
    const { count } = await supabase
      .from('gestion_documents')
      .select('*', { count: 'exact', head: true })
      .eq('doc_type', doc_type)
      .gte('created_at', `${year}-01-01`);

    const num = (count || 0) + 1;
    payload.doc_number = `${prefix}-${year}-${String(num).padStart(4, '0')}`;

    const { data: inserted, error } = await supabase
      .from('gestion_documents')
      .insert(payload)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(inserted);
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

  const { error } = await supabase.from('gestion_documents').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
