import type { Metadata } from 'next';
import { getSettings } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Entreprise | SOTIP-CI',
  description: "SOTIP-CI (Société de Travaux Industriels et de Prestation de Côte d'Ivoire) : construction métallique, charpenterie, chaudronnerie, génie civil et maintenance industrielle.",
};

export default async function EntreprisePage() {
  const settings = await getSettings();
  const contactAddress = settings.contact_address || 'MARCORY ANOUMABO Rue Bamba Kassoum';

  return (
    <>
      <Header settings={settings} />
      <main>
        <section className="page-header">
          <div className="container">
            <h1>L'Entreprise</h1>
            <p>SOTIP-CI, votre partenaire industriel de confiance en Côte d'Ivoire</p>
          </div>
        </section>

        <section className="about-content">
          <div className="container">
            <div className="grid">
              <div>
                <img src="/images/slide/1.jpg" alt="SOTIP-CI - Bureau d'études" />
              </div>
              <div className="about-text">
                <h2>Société de Travaux Industriels et de Prestation de Côte d'Ivoire</h2>
                <p>
                  Située en Côte d'Ivoire à Abidjan, SOTIP-CI est une Société à Responsabilité Limitée (SARL) spécialisée dans les domaines de la construction métallique et mixte, la charpenterie métallique, le graissage industriel, le génie civil, le calorifugeage, le sablage et peinture, la soudure, la chaudronnerie, la tuyauterie et la maintenance industrielle.
                </p>
                <p>
                  Forte d'une équipe d'ingénieurs et de techniciens qualifiés, SOTIP-CI intervient sur l'ensemble des ouvrages métalliques, de la conception à la réalisation, en respectant les normes internationales les plus exigeantes.
                </p>
                <p>
                  Nos interventions couvrent les secteurs pétrolier, minier, agro-industriel, industriel et commercial. La qualité, la sécurité et le respect des délais sont les valeurs fondamentales qui guident notre action au quotidien.
                </p>

                <div className="infos">
                  <div className="info-item">
                    <span className="info-label">Statut</span>
                    <span className="info-value">SARL</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Effectif</span>
                    <span className="info-value">Plus de 50 collaborateurs</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Localisation</span>
                    <span className="info-value">{contactAddress}, Côte d'Ivoire</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Direction</span>
                    <span className="info-value"><a href="/manager">M. Evrard YAO</a>, Directeur technique</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-light">
          <div className="container">
            <ScrollReveal>
              <div className="section-title">
                <h2>Nos Valeurs</h2>
                <div className="line"></div>
              </div>
            </ScrollReveal>
            <div className="features-grid">
              <ScrollReveal>
                <div className="feature-item">
                  <div className="feature-icon">&#10003;</div>
                  <h3>Qualité</h3>
                  <p>Respect des normes internationales et contrôle rigoureux à chaque étape de nos réalisations.</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div className="feature-item">
                  <div className="feature-icon">&#128737;</div>
                  <h3>Sécurité</h3>
                  <p>Une culture sécurité ancrée dans nos processus pour protéger nos équipes et vos installations.</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="feature-item">
                  <div className="feature-icon">&#128339;</div>
                  <h3>Respect des délais</h3>
                  <p>Un engagement ferme sur les délais pour garantir la réussite de vos projets dans les temps.</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
