import type { Metadata } from 'next';
import { getSettings, getProjects } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { PROJECT_ORDER } from '@/types';

export const metadata: Metadata = {
  title: 'Projets réalisés | SOTIP-CI',
  description: "Découvrez les projets réalisés par SOTIP-CI : construction métallique, charpenterie, chaudronnerie, génie civil et maintenance industrielle en Côte d'Ivoire.",
};

export default async function ProjetsPage() {
  const [settings, projects] = await Promise.all([
    getSettings(),
    getProjects(),
  ]);

  const orderedProjects = PROJECT_ORDER
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <>
      <Header settings={settings} />
      <main>
        <section className="page-header">
          <div className="container">
            <h1>Projets réalisés</h1>
            <p>Découvrez notre savoir-faire à travers nos réalisations</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="projects-grid">
              {orderedProjects.map((p) => p && (
                <ScrollReveal key={p.slug}>
                  <a href={`/${p.slug}`} className="project-card">
                    <img src={p.card_image || ''} alt={p.title} loading="lazy" />
                    <div className="project-overlay">
                      <span className="year">{p.year}</span>
                      <h3>{p.title}</h3>
                      <p>{p.description}</p>
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
