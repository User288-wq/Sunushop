import './globals.css';
import Header from '../components/shared/Header';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'SunuShop - Social commerce sénégalais',
  description: 'Vendez sur TikTok, recevez les paiements Wave/Orange Money, livrez facilement.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <Header />
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
