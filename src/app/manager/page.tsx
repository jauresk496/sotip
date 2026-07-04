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

  const image = settings.manager_image || '/images/slide/1.jpg';
  const name = settings.manager_name || 'M. Evrard YAO';
  const role = settings.manager_role || 'Directeur technique';
  const bio = (settings.manager_bio || '').split('\n').filter(Boolean);
  const experience = settings.manager_experience || '15+ ans dans l\'industrie';
  const expertise = settings.manager_expertise || 'Construction métallique, maintenance industrielle';
  const linkedin = settings.manager_linkedin || '';

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
                <img src={image} alt={`SOTIP-CI - ${name}`} />
              </div>
              <div className="about-text">
                <h2>{name}</h2>
                <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: '1.1rem' }}>{role}</p>
                {bio.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}

                <div className="infos" style={{ marginTop: '30px' }}>
                  <div className="info-item">
                    <span className="info-label">Fonction</span>
                    <span className="info-value">{role}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Expérience</span>
                    <span className="info-value">{experience}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Expertise</span>
                    <span className="info-value">{expertise}</span>
                  </div>
                </div>
                {linkedin && (
                  <p style={{ marginTop: '20px' }}>
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener"
                      className="btn btn-outline"
                    >
                      Voir le profil LinkedIn
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
