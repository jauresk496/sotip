'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SERVICE_LIST } from '@/types';

export default function Header({ settings }: { settings: Record<string, string> }) {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const contactPhone = settings.contact_phone || '+225 07 48 26 95 74';
  const contactEmail = settings.contact_email || 'info@sotipci.net';
  const siteName = settings.site_name || 'SOTIP-CI';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (page: string) => {
    if (page === 'accueil') return pathname === '/';
    if (page === 'presentation') return pathname === '/entreprise' || pathname === '/manager';
    if (page === 'activite') return SERVICE_LIST.some((s) => pathname === `/${s.slug}`);
    if (page === 'projets') return pathname === '/proj_real' || SERVICE_LIST.some(() => false);
    if (page === 'contact') return pathname === '/contact';
    return false;
  };

  const isProjectPage = () => {
    const projectSlugs = ['carbone', 'green', 'onomo', 'radisson'];
    return projectSlugs.some((s) => pathname === `/${s}`);
  };

  const toggleDropdown = (name: string) => {
    if (window.innerWidth <= 768) {
      setOpenDropdown(openDropdown === name ? null : name);
    }
  };

  return (
    <>
      <div className="top-bar">
        <div className="container">
          <a href={`tel:${contactPhone.replace(/\s/g, '')}`}>&#9742; {contactPhone}</a>
          <a href={`mailto:${contactEmail}`}>&#9993; {contactEmail}</a>
        </div>
      </div>

      <header className={`header${scrolled ? ' scrolled' : ''}`} id="header">
        <div className="container">
          <Link href="/" className="logo">
            <img src="/images/sotipci-logo.png" alt={siteName} />
          </Link>
          <button
            className={`nav-toggle${navOpen ? ' active' : ''}`}
            aria-label="Menu"
            onClick={() => setNavOpen(!navOpen)}
          >
            <span></span><span></span><span></span>
          </button>
          <nav className={`nav${navOpen ? ' open' : ''}`} id="mainNav">
            <Link
              href="/"
              className={isActive('accueil') ? 'active' : ''}
              onClick={() => setNavOpen(false)}
            >
              Accueil
            </Link>
            <div className={`has-dropdown${openDropdown === 'presentation' ? ' open' : ''}`}>
              <a
                href="/entreprise"
                className={isActive('presentation') ? 'active' : ''}
                onClick={(e) => {
                  if (window.innerWidth <= 768) {
                    e.preventDefault();
                    toggleDropdown('presentation');
                  }
                }}
              >
                Présentation
              </a>
              <div className="dropdown">
                <Link href="/entreprise" onClick={() => setNavOpen(false)}>Entreprise</Link>
                <Link href="/manager" onClick={() => setNavOpen(false)}>Manager</Link>
              </div>
            </div>
            <div className={`has-dropdown${openDropdown === 'activite' ? ' open' : ''}`}>
              <a
                href="/construction-metallique"
                className={isActive('activite') ? 'active' : ''}
                onClick={(e) => {
                  if (window.innerWidth <= 768) {
                    e.preventDefault();
                    toggleDropdown('activite');
                  }
                }}
              >
                Activités
              </a>
              <div className="dropdown">
                {SERVICE_LIST.map((s) => (
                  <Link key={s.slug} href={`/${s.slug}`} onClick={() => setNavOpen(false)}>
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/proj_real"
              className={isActive('projets') || isProjectPage() ? 'active' : ''}
              onClick={() => setNavOpen(false)}
            >
              Réalisations
            </Link>
            <Link
              href="/contact"
              className={isActive('contact') ? 'active' : ''}
              onClick={() => setNavOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
