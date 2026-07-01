import type { Metadata } from 'next';
import { getSettings, getService, getProject, getProjects } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceSidebar from '@/components/ServiceSidebar';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DevisButton from '@/components/DevisButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Détail | SOTIP-CI',
  description: 'Société de Travaux Industriels et de Prestation de Côte d\'Ivoire',
};

export default async function DynamicPage({
  params,
}: {
  params: { slug: string };
}) {
  const [settings, service, project, allProjects] = await Promise.all([
    getSettings(),
    getService(params.slug),
    getProject(params.slug),
    getProjects(),
  ]);

  if (!service && !project) notFound();

  if (service) {
    return (
      <>
        <Header settings={settings} />
        <main>
          <section className="page-header">
            <div className="container">
              <h1>{service.title}</h1>
              <p>{service.intro}</p>
            </div>
          </section>
          <section className="content-page">
            <div className="container">
              <div className="grid">
                <div className="content-main">
                  <h2>{service.title}</h2>
                  <p>{service.intro}</p>
                  {service.image && (
                    <img src={`/${service.image}`} alt={service.title} />
                  )}
                  <p style={{ whiteSpace: 'pre-line' }}>{service.content}</p>
                  <div style={{ marginTop: '30px' }}>
                    <DevisButton className="btn" />
                  </div>
                </div>
                <div className="content-sidebar">
                  <ServiceSidebar activeSlug={service.slug} />
                  <div style={{ marginTop: '20px' }}>
                    <DevisButton className="btn" style={{ width: '100%', justifyContent: 'center' }} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer settings={settings} />
      </>
    );
  }

  if (project) {
    const otherProjects = allProjects.filter((p) => p.slug !== project.slug);
    return (
      <>
        <Header settings={settings} />
        <main>
          <section className="page-header">
            <div className="container">
              <h1>{project.page_title}</h1>
              <p>{project.description}</p>
            </div>
          </section>
          <section className="content-page">
            <div className="container">
              <div className="grid">
                <div className="content-main">
                  <h2>{project.title}</h2>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text)' }}>{project.description}</p>
                  {project.main_image && (
                    <img src={project.main_image} alt={project.title} />
                  )}
                  {project.content && project.content.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  {project.slug === 'green' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '20px' }}>
                      {['01', '02', '03', '04'].map((n) => (
                        <img
                          key={n}
                          src={`/realisation/images_green/${n}.jpg`}
                          alt={`Réalisation ${n}`}
                          style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}
                        />
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: '30px' }}>
                    <DevisButton className="btn" />
                  </div>
                </div>
                <div className="content-sidebar">
                  <div className="sidebar-card">
                    <h3>Autres projets</h3>
                    <ul>
                      {otherProjects.map((p) => (
                        <li key={p.slug}>
                          <Link href={`/${p.slug}`}>{p.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <DevisButton className="btn" style={{ width: '100%', justifyContent: 'center' }} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer settings={settings} />
      </>
    );
  }

  notFound();
}
