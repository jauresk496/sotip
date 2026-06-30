import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SOTIP-CI | Société de Travaux Industriels et de Prestation de Côte d\'Ivoire',
  description: 'SOTIP-CI : construction métallique, charpenterie métallique, chaudronnerie, tuyauterie, génie civil, maintenance industrielle en Côte d\'Ivoire.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
