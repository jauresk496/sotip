import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SOTIP-CI | Société de Travaux Industriels et de Prestation de Côte d\'Ivoire',
  description: 'SOTIP-CI : construction métallique, charpenterie métallique, chaudronnerie, tuyauterie, génie civil, maintenance industrielle en Côte d\'Ivoire.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </head>
      <body>{children}</body>
    </html>
  );
}
