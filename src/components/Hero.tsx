'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { SlideItem } from '@/types';
import { HERO_SLIDES } from '@/types';

export default function Hero({ slides: propSlides }: { slides?: SlideItem[] }) {
  const [current, setCurrent] = useState(0);
  const slides = propSlides && propSlides.length > 0
    ? propSlides.map((s) => s.image)
    : HERO_SLIDES;

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="hero" id="hero">
      {slides.map((img, i) => (
        <div key={i} className={`hero-slide${i === current ? ' active' : ''}`}>
          <img src={img} alt={`SOTIP-CI - ${i === 0 ? 'Accueil' : 'Réalisation'}`} />
        </div>
      ))}
      <div className="hero-overlay">
        <div className="container">
          <div className="hero-content">
            <span className="tag">Expertise Industrielle</span>
            <h1>Société de Travaux Industriels et de Prestation</h1>
            <p>
              Construction métallique, charpenterie, chaudronnerie, tuyauterie, génie civil et maintenance industrielle en Côte d'Ivoire.
            </p>
            <button
              className="btn"
              onClick={() => window.dispatchEvent(new Event('open-devis-modal'))}
            >
              Demander un devis
            </button>
            <Link
              href="/entreprise"
              className="btn btn-outline"
              style={{ marginLeft: '12px', borderColor: 'rgba(255,255,255,0.6)', color: 'var(--white)' }}
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-arrows">
        <button className="hero-prev" aria-label="Précédent" onClick={prev}>&lsaquo;</button>
        <button className="hero-next" aria-label="Suivant" onClick={next}>&rsaquo;</button>
      </div>
    </section>
  );
}
