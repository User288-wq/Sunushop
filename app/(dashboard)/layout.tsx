'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Package, ShoppingCart, LayoutDashboard, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  if (!user) return null;

  const navItems = [
    { href: '/vendeur/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/vendeur/produits', label: 'Mes produits', icon: Package },
    { href: '/vendeur/commandes', label: 'Mes commandes', icon: ShoppingCart },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-green-600">SunuShop</h1>
          <p className="text-sm text-gray-500">Espace vendeur</p>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full mt-10"
          >
            <LogOut size={18} />
            <span>Retour au site</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
