import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0] ?? '';
const basePath =
  process.env.GITHUB_ACTIONS === 'true' &&
  repository &&
  repository.toLowerCase() !== `${owner.toLowerCase()}.github.io`
    ? `/${repository}`
    : '';
const faviconUrl = `${basePath}/favicon.svg`;
const socialImageUrl = '/og.png';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'SurTec | Ingeniería y Tecnología',
  description: 'Soluciones que conectan ingeniería, tecnología y resultados.',
  icons: { icon: faviconUrl },
  openGraph: {
    title: 'SurTec | Ingeniería y Tecnología',
    description: 'Ingeniería y tecnología que conecta proyectos con resultados.',
    type: 'website',
    images: [{ url: socialImageUrl, width: 1200, height: 630, alt: 'SurTec, ingeniería y tecnología' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SurTec | Ingeniería y Tecnología',
    description: 'Ingeniería y tecnología que conecta proyectos con resultados.',
    images: [socialImageUrl],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
