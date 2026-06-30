import { supabase } from './supabase';
import type { Service, Project, Partner, Settings, GalleryItem } from '@/types';

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase.from('settings').select('key, value');
  if (error || !data) return {};
  const settings: Settings = {};
  data.forEach((row: { key: string; value: string }) => {
    settings[row.key] = row.value;
  });
  return settings;
}

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) return [];
  return data as Service[];
}

export async function getService(slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error || !data) return null;
  return data as Service;
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) return [];
  return data as Project[];
}

export async function getProject(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error || !data) return null;
  return data as Project;
}

export async function getPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) return [];
  return data as Partner[];
}

export async function getAllServiceSlugs(): Promise<string[]> {
  const services = await getServices();
  return services.map((s) => s.slug);
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();
  return projects.map((p) => p.slug);
}

export async function getGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) return [];
  return data as GalleryItem[];
}
