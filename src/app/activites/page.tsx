import type { Metadata } from 'next';
import Link from 'next/link';
import { getSettings, getServices } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Nos Activités | SOTIP-CI',
  description: "Découvrez l'ensemble de nos services : construction métallique, charpenterie, chaudronnerie, tuyauterie, génie civil, maintenance industrielle et plus.",
};

export default async function ActivitesPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  return (
    <>
      <Header settings={settings} />
      <main>
        <section className="page-header">
          <div className="container">
            <h1>Nos Activités</h1>
            <p>Des solutions complètes pour l&apos;industrie et le génie civil</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="services-grid">
              {services.map((svc) => (
                <ScrollReveal key={svc.slug}>
                  <div className="service-card">
                    {svc.image && <img src={svc.image} alt={svc.title} loading="lazy" />}
                    <div className="service-card-body">
                      <h3>{svc.title}</h3>
                      <p>{svc.intro}</p>
                      <Link href={`/${svc.slug}`} className="btn">En savoir plus</Link>
                    </div>
                  </div>
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
