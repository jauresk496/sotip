import type { Metadata } from 'next';
import { getSettings } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Notre Équipe Dirigeante | SOTIP-CI',
  description: "Direction de SOTIP-CI : M. Evrard YAO, Directeur technique. Présentation de l'équipe dirigeante de SOTIP-CI en Côte d'Ivoire.",
};

export default async function ManagerPage() {
  const settings = await getSettings();

  return (
    <>
      <Header settings={settings} />
      <main>
        <section className="page-header">
          <div className="container">
            <h1>Notre Direction</h1>
            <p>Une équipe dirigeante expérimentée au service de l'industrie</p>
          </div>
        </section>

        <section className="about-content">
          <div className="container">
            <div className="grid">
              <div>
                <img src="/images/slide/1.jpg" alt="SOTIP-CI - Direction" />
              </div>
              <div className="about-text">
                <h2>M. Evrard YAO</h2>
                <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: '1.1rem' }}>Directeur technique</p>
                <p>
                  Fort de plus de 15 ans d'expérience dans le domaine de la construction métallique et de la maintenance industrielle, M. Evrard YAO dirige SOTIP-CI avec la vision d'apporter des solutions industrielles de haute qualité en Côte d'Ivoire et dans la sous-région.
                </p>
                <p>
                  Son leadership et son expertise technique sont les piliers sur lesquels repose la réputation d'excellence de SOTIP-CI.
                </p>

                <div className="infos" style={{ marginTop: '30px' }}>
                  <div className="info-item">
                    <span className="info-label">Fonction</span>
                    <span className="info-value">Directeur technique</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Expérience</span>
                    <span className="info-value">15+ ans dans l'industrie</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Expertise</span>
                    <span className="info-value">Construction métallique, maintenance industrielle</span>
                  </div>
                </div>
                <p style={{ marginTop: '20px' }}>
                  <a
                    href="https://ci.linkedin.com/in/evrard-yao-965ba3111"
                    target="_blank"
                    rel="noopener"
                    className="btn btn-outline"
                  >
                    Voir le profil LinkedIn
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
