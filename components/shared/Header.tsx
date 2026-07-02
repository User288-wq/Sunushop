'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, Menu } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="SunuShop" width={160} height={48} priority />
        </Link>

        {/* Menu desktop avec plus d'espace */}
        <div className="hidden md:flex items-center gap-12">
          <Link href="/" className="hover:text-green-600 transition text-base font-medium">Accueil</Link>
          <Link href="/vendeur/produits/ajouter" className="hover:text-green-600 transition text-base font-medium">Vendre</Link>
          {!loading && user ? (
            <Link href="/vendeur/dashboard" className="hover:text-green-600 transition text-base font-medium">Dashboard</Link>
          ) : (
            <Link href="/login" className="hover:text-green-600 transition text-base font-medium">Connexion</Link>
          )}
          <Link href="/panier" className="relative hover:text-green-600 transition">
            <ShoppingCart className="w-6 h-6" />
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-green-600 text-base">Accueil</Link>
          <Link href="/vendeur/produits/ajouter" onClick={() => setMenuOpen(false)} className="hover:text-green-600 text-base">Vendre</Link>
          {!loading && user ? (
            <Link href="/vendeur/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-green-600 text-base">Dashboard</Link>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="hover:text-green-600 text-base">Connexion</Link>
          )}
          <Link href="/panier" onClick={() => setMenuOpen(false)} className="hover:text-green-600 text-base">Panier</Link>
        </div>
      )}
    </header>
  );
}
