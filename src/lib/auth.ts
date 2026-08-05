import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.VERCEL) throw new Error('JWT_SECRET doit être défini en production');
    return 'sotip-ci-jwt-secret-dev-only';
  }
  return secret;
}
const COOKIE_NAME = 'admin_session';
const GESTION_COOKIE_NAME = 'gestion_session';
const BRUTE_FORCE_KEY = 'admin_brute_force';
const GESTION_BRUTE_KEY = 'gestion_brute_force';

export async function getSetting(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();
  if (error || !data) return null;
  return data.value;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const { data: existing } = await supabase
    .from('settings')
    .select('key')
    .eq('key', key)
    .single();

  if (existing) {
    await supabase.from('settings').update({ value }).eq('key', key);
  } else {
    await supabase.from('settings').insert({ key, value });
  }
}

export async function getAdminHash(): Promise<string | null> {
  return getSetting('admin_password_hash');
}

export async function getAdminUsername(): Promise<string> {
  return (await getSetting('admin_username')) || 'admin';
}

async function getBruteForceData(): Promise<{ attempts: number; lockUntil: number }> {
  const raw = await getSetting(BRUTE_FORCE_KEY);
  if (!raw) return { attempts: 0, lockUntil: 0 };
  try {
    return JSON.parse(raw);
  } catch {
    return { attempts: 0, lockUntil: 0 };
  }
}

async function saveBruteForceData(data: { attempts: number; lockUntil: number }): Promise<void> {
  await setSetting(BRUTE_FORCE_KEY, JSON.stringify(data));
}

export async function checkBruteForce(): Promise<{ blocked: boolean; remainingMinutes?: number }> {
  const data = await getBruteForceData();
  if (data.lockUntil > Date.now()) {
    const remainingMs = data.lockUntil - Date.now();
    return { blocked: true, remainingMinutes: Math.ceil(remainingMs / 60000) };
  }
  if (data.lockUntil > 0 && data.lockUntil <= Date.now()) {
    await saveBruteForceData({ attempts: 0, lockUntil: 0 });
  }
  return { blocked: false };
}

export async function recordFailedAttempt(): Promise<void> {
  const data = await getBruteForceData();
  data.attempts += 1;
  if (data.attempts >= 5) {
    data.lockUntil = Date.now() + 15 * 60 * 1000;
  }
  await saveBruteForceData(data);
}

export async function resetBruteForce(): Promise<void> {
  await saveBruteForceData({ attempts: 0, lockUntil: 0 });
}

export async function verifyAdmin(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  const { blocked, remainingMinutes } = await checkBruteForce();
  if (blocked) {
    return { success: false, error: `Trop de tentatives. Réessayez dans ${remainingMinutes} min.` };
  }

  const expectedUsername = await getAdminUsername();
  if (username !== expectedUsername) {
    await recordFailedAttempt();
    return { success: false, error: 'Identifiants incorrects.' };
  }

  const hash = await getAdminHash();
  if (!hash) {
    return { success: false, error: 'Compte admin non configuré.' };
  }

  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    await recordFailedAttempt();
    return { success: false, error: 'Identifiants incorrects.' };
  }

  await resetBruteForce();
  return { success: true };
}

export async function createSession(): Promise<string> {
  const token = jwt.sign({ role: 'admin', ts: Date.now() }, getJwtSecret(), { expiresIn: '24h' });
  return token;
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { role?: string };
    return decoded?.role === 'admin';
  } catch {
    return false;
  }
}

export async function requireAdmin(): Promise<boolean> {
  return getSession();
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ===== Gestionnaire auth =====

export async function getGestionHash(): Promise<string | null> {
  return getSetting('gestion_password_hash');
}

export async function getGestionUsername(): Promise<string> {
  return (await getSetting('gestion_username')) || 'gestion';
}

async function getGestionBruteData(): Promise<{ attempts: number; lockUntil: number }> {
  const raw = await getSetting(GESTION_BRUTE_KEY);
  if (!raw) return { attempts: 0, lockUntil: 0 };
  try { return JSON.parse(raw); } catch { return { attempts: 0, lockUntil: 0 }; }
}

async function saveGestionBruteData(data: { attempts: number; lockUntil: number }): Promise<void> {
  await setSetting(GESTION_BRUTE_KEY, JSON.stringify(data));
}

export async function checkGestionBruteForce(): Promise<{ blocked: boolean; remainingMinutes?: number }> {
  const data = await getGestionBruteData();
  if (data.lockUntil > Date.now()) {
    return { blocked: true, remainingMinutes: Math.ceil((data.lockUntil - Date.now()) / 60000) };
  }
  if (data.lockUntil > 0 && data.lockUntil <= Date.now()) {
    await saveGestionBruteData({ attempts: 0, lockUntil: 0 });
  }
  return { blocked: false };
}

export async function recordGestionFailedAttempt(): Promise<void> {
  const data = await getGestionBruteData();
  data.attempts += 1;
  if (data.attempts >= 5) data.lockUntil = Date.now() + 15 * 60 * 1000;
  await saveGestionBruteData(data);
}

export async function resetGestionBruteForce(): Promise<void> {
  await saveGestionBruteData({ attempts: 0, lockUntil: 0 });
}

export async function verifyGestionnaire(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  const { blocked, remainingMinutes } = await checkGestionBruteForce();
  if (blocked) return { success: false, error: `Trop de tentatives. Réessayez dans ${remainingMinutes} min.` };

  const expectedUsername = await getGestionUsername();
  if (username !== expectedUsername) {
    await recordGestionFailedAttempt();
    return { success: false, error: 'Identifiants incorrects.' };
  }

  const hash = await getGestionHash();
  if (!hash) return { success: false, error: 'Compte gestionnaire non configuré.' };

  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    await recordGestionFailedAttempt();
    return { success: false, error: 'Identifiants incorrects.' };
  }

  await resetGestionBruteForce();
  return { success: true };
}

export async function createGestionSession(): Promise<string> {
  return jwt.sign({ role: 'gestion', ts: Date.now() }, getJwtSecret(), { expiresIn: '24h' });
}

export async function getGestionSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(GESTION_COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { role?: string };
    return decoded?.role === 'gestion' || decoded?.role === 'admin';
  } catch { return false; }
}

export async function clearGestionSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(GESTION_COOKIE_NAME);
}
