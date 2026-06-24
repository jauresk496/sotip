import type { Metadata } from 'next';
import { getSettings } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Contact | SOTIP-CI',
  description: "Contactez SOTIP-CI pour vos projets de construction métallique, charpenterie, chaudronnerie et maintenance industrielle en Côte d'Ivoire.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const contactEmail = settings.contact_email || 'info@sotipci.net';
  const contactPhone = settings.contact_phone || '+225 07 48 26 95 74';
  const contactFax = settings.contact_fax || '+225 27 21 29 02 87';
  const contactAddress = settings.contact_address || 'MARCORY ANOUMABO Rue Bamba Kassoum';

  return (
    <>
      <Header settings={settings} />
      <main>
        <section className="contact-hero">
          <div className="container">
            <h1>Contactez-nous</h1>
            <p>Discutons de votre projet. Demandez un devis gratuit ou une information.</p>
          </div>
        </section>

        <section className="contact-section">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-info">
                <h3>Nos Coordonnées</h3>
                <div className="info-card">
                  <div className="icon">&#128205;</div>
                  <div>
                    <h4>Adresse</h4>
                    <p>{contactAddress}</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="icon">&#9742;</div>
                  <div>
                    <h4>Téléphone</h4>
                    <p>{contactPhone}</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="icon">&#128224;</div>
                  <div>
                    <h4>Fax</h4>
                    <p>{contactFax}</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="icon">&#9993;</div>
                  <div>
                    <h4>Email</h4>
                    <p><a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
                  </div>
                </div>
                <div className="map-wrap">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.470725731615!2d-3.9601716!3d5.3087063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ec3b25f512b9%3A0x43d3869d2be98f8d!2sRue%20Bamba%20Kassoum!5e0!3m2!1sfr!2sci!4v1"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
                <div style={{ marginTop: '20px', padding: '20px', background: 'var(--light)', borderRadius: 'var(--radius)', border: '2px dashed var(--gray-light)' }}>
                  <p style={{ fontWeight: 600, color: 'var(--primary)' }}>&#128196; Recrutement</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    Pour toute demande d'emploi ou de stage, veuillez envoyer votre candidature à :{' '}
                    <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                  </p>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
