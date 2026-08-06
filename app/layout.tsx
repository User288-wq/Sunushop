'use client';

import { useEffect, useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/shared/Header';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <Header />
          <main className="min-h-screen bg-gray-50">
            {isClient ? children : null}
          </main>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
