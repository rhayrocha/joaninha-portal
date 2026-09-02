import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Joaninha | Portal do Responsável',
  description: 'Portal do Responsável - Joaninha Creche Escola Bilíngue',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans min-h-screen bg-joaninha-off-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
