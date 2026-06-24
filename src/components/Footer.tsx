import Link from 'next/link';
import { SERVICE_LIST } from '@/types';

export default function Footer({ settings }: { settings: Record<string, string> }) {
  const siteName = settings.site_name || 'SOTIP-CI';
  const tagline = settings.site_tagline || "Société de Travaux Industriels et de Prestation de Côte d'Ivoire";
  const contactEmail = settings.contact_email || 'info@sotipci.net';
  const contactPhone = settings.contact_phone || '+225 07 48 26 95 74';
  const contactFax = settings.contact_fax || '+225 27 21 29 02 87';
  const contactAddress = settings.contact_address || 'MARCORY ANOUMABO Rue Bamba Kassoum';

  const firstHalf = SERVICE_LIST.slice(0, 6);
  const secondHalf = SERVICE_LIST.slice(6);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <img
              src="/images/sotipci-logo.png"
              alt={siteName}
              style={{ maxWidth: '180px', height: 'auto', background: '#fff', padding: '6px 10px', borderRadius: '4px', marginBottom: '10px' }}
            />
            <p>{tagline}</p>
            <p style={{ marginTop: '15px' }}>
              Forte d'une équipe d'ingénieurs et de techniciens qualifiés, SOTIP-CI intervient sur l'ensemble des ouvrages métalliques, de la conception à la réalisation.
            </p>
          </div>
          <div className="footer-col">
            <h3>Activités</h3>
            <ul>
              {firstHalf.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h3>&nbsp;</h3>
            <ul>
              {secondHalf.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
              <li><Link href="/proj_real">Projets réalisés</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contact</h3>
            <ul className="footer-contact">
              <li><span>&#128205;</span> {contactAddress}</li>
              <li><span>&#9742;</span> {contactPhone}</li>
              <li><span>&#128224;</span> {contactFax}</li>
              <li><span>&#9993;</span> <a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} SOTIP-CI. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
