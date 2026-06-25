import { NextResponse } from 'next/server';
import { verifyAdmin, createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Identifiant et mot de passe requis' }, { status: 400 });
    }

    const result = await verifyAdmin(username, password);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const token = await createSession();
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
