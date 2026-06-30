import { getSettings, getProjects, getPartners, getGallery, getSlides } from '@/lib/data';
export const dynamic = 'force-dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ScrollReveal from '@/components/ScrollReveal';
import Stats from '@/components/Stats';
import Partners from '@/components/Partners';
import Link from 'next/link';
import { PROJECT_ORDER } from '@/types';
import type { GalleryItem } from '@/types';

export default async function HomePage() {
  const [settings, projects, partners, gallery, slides] = await Promise.all([
    getSettings(),
    getProjects(),
    getPartners(),
    getGallery(),
    getSlides(),
  ]);

  const orderedProjects = PROJECT_ORDER
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <>
      <Header settings={settings} />
      <main>
        <Hero slides={slides} />

        <section className="section">
          <div className="container">
            <ScrollReveal>
              <div className="section-title">
                <h2>Galerie de nos réalisations</h2>
                <div className="line"></div>
                <p>Découvrez nos réalisations en images</p>
              </div>
            </ScrollReveal>
            {gallery.length > 0 ? (
              <div className="gallery-grid">
                {gallery.map((item: GalleryItem) => (
                  <ScrollReveal key={item.id}>
                    <div className="gallery-item">
                      <img src={item.image} alt={item.title} loading="lazy" />
                      {item.title && <div className="gallery-caption">{item.title}</div>}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "var(--muted)" }}>Aucune image pour le moment.</p>
            )}
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <Stats />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <ScrollReveal>
              <div className="section-title">
                <h2>Réalisations Récentes</h2>
                <div className="line"></div>
                <p>Découvrez quelques-uns de nos projets</p>
              </div>
            </ScrollReveal>
            <div className="projects-grid">
              {orderedProjects.map((p) => p && (
                <ScrollReveal key={p.slug}>
                  <Link href={`/${p.slug}`} className="project-card">
                    <img src={p.card_image || ''} alt={p.title} loading="lazy" />
                    <div className="project-overlay">
                      <span className="year">{p.year}</span>
                      <h3>{p.title}</h3>
                      <p>{p.description}</p>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <Link href="/proj_real" className="btn btn-secondary">Voir toutes les réalisations</Link>
            </div>
          </div>
        </section>

        <section className="section section-light">
          <div className="container">
            <ScrollReveal>
              <div className="section-title">
                <h2>Ils nous font confiance</h2>
                <div className="line"></div>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <Partners partners={partners} />
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
