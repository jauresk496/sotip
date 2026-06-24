import { getSettings, getProjects, getPartners } from '@/lib/data';
export const dynamic = 'force-dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ScrollReveal from '@/components/ScrollReveal';
import Stats from '@/components/Stats';
import Partners from '@/components/Partners';
import Link from 'next/link';
import { HOME_SERVICE_CARDS, PROJECT_ORDER } from '@/types';

export default async function HomePage() {
  const [settings, projects, partners] = await Promise.all([
    getSettings(),
    getProjects(),
    getPartners(),
  ]);

  const orderedProjects = PROJECT_ORDER
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <>
      <Header settings={settings} />
      <main>
        <Hero />

        <section className="section">
          <div className="container">
            <ScrollReveal>
              <div className="section-title">
                <h2>Notre Expertise</h2>
                <div className="line"></div>
                <p>Une équipe d'ingénieurs et techniciens qualifiés pour vos projets industriels</p>
              </div>
            </ScrollReveal>
            <div className="features-grid">
              <ScrollReveal>
                <div className="feature-item">
                  <div className="feature-icon">&#9881;</div>
                  <h3>Construction Métallique</h3>
                  <p>Charpentes, bâtiments industriels, ponts et structures métalliques sur mesure</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div className="feature-item">
                  <div className="feature-icon">&#9881;</div>
                  <h3>Chaudronnerie &amp; Tuyauterie</h3>
                  <p>Cuves, réservoirs, échangeurs et réseaux de canalisations industrielles</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="feature-item">
                  <div className="feature-icon">&#9881;</div>
                  <h3>Maintenance Industrielle</h3>
                  <p>Maintenance préventive et curative pour les secteurs pétrolier, minier et agro-industriel</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="section section-light">
          <div className="container">
            <ScrollReveal>
              <div className="section-title">
                <h2>Nos Services</h2>
                <div className="line"></div>
                <p>Des solutions complètes pour l'industrie et le génie civil</p>
              </div>
            </ScrollReveal>
            <div className="services-grid">
              {HOME_SERVICE_CARDS.map((card, i) => (
                <ScrollReveal key={card.slug} delay={i > 0 ? Math.min(i, 4) * 100 : 0}>
                  <div className="service-card">
                    <img src={card.img} alt={card.title} loading="lazy" />
                    <div className="service-card-body">
                      <h3 dangerouslySetInnerHTML={{ __html: card.title }} />
                      <p>{card.desc}</p>
                      <Link href={`/${card.slug}`} className="btn">En savoir plus</Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
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
