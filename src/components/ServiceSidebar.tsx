import Link from 'next/link';
import { SERVICE_LIST } from '@/types';

export default function ServiceSidebar({ activeSlug }: { activeSlug?: string }) {
  return (
    <div className="sidebar-card">
      <h3>Nos activités</h3>
      <ul>
        {SERVICE_LIST.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/${s.slug}`}
              style={s.slug === activeSlug ? { color: 'var(--primary)', fontWeight: 600 } : undefined}
            >
              {s.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
