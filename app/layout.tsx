import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import './globals.css';

export const metadata: Metadata = {
  title: 'SurTec | Ingeniería y Tecnología',
  description: 'Soluciones que conectan ingeniería, tecnología y resultados.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
