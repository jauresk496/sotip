'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header({ settings }: { settings: Record<string, string> }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const contactPhone = settings.contact_phone || '+225 07 48 26 95 74';
  const contactEmail = settings.contact_email || 'info@sotipci.net';
  const siteName = settings.site_name || 'SOTIP-CI';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const isPresentation = isActive('/entreprise') || isActive('/manager');

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
              className={pathname === '/' ? 'active' : ''}
              onClick={() => setNavOpen(false)}
            >
              Accueil
            </Link>
            <div className={`has-dropdown${isPresentation ? ' open' : ''}`}>
              <Link
                href="/entreprise"
                className={isPresentation ? 'active' : ''}
              >
                Présentation
              </Link>
              <div className="dropdown">
                <Link href="/entreprise" onClick={() => setNavOpen(false)}>Entreprise</Link>
                <Link href="/manager" onClick={() => setNavOpen(false)}>Manager</Link>
              </div>
            </div>
            <Link
              href="/activites"
              className={isActive('/activites') || isActive('/construction-metallique') ? 'active' : ''}
              onClick={() => setNavOpen(false)}
            >
              Activités
            </Link>
            <Link
              href="/proj_real"
              className={isActive('/proj_real') || isActive('/green') ? 'active' : ''}
              onClick={() => setNavOpen(false)}
            >
              Réalisations
            </Link>
            <Link
              href="/contact"
              className={isActive('/contact') ? 'active' : ''}
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
