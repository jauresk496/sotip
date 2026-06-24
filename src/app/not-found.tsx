import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-404">
      <div className="container">
        <h1>404</h1>
        <h2>Page non trouvée</h2>
        <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link href="/" className="btn">Retour à l'accueil</Link>
      </div>
    </div>
  );
}
