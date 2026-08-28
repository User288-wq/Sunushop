"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useWhatsApp } from "@/context/WhatsAppContext";
import { useTheme } from "@/app/providers/ThemeProvider";

export function Navbar() {
  const { unreadCount, isConnected } = useWhatsApp();
  const { theme, toggleTheme } = useTheme();
  const [cartCount, setCartCount] = useState(0);

  // Récupérer le nombre d'articles dans le panier
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  }, []);

  // Écouter les changements du panier
  useEffect(() => {
    const handleCartUpdate = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const navItems = [
    { href: "/", label: "🏠 Accueil" },
    { href: "/chat", label: "💬 Chat" },
    { href: "/whatsapp", label: "📱 WhatsApp" },
    { href: "/dashboard", label: "📊 Dashboard" },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-200 group-hover:scale-105 transition">
              S
            </div>
            <span className="text-xl font-bold gradient-text">SunuShop</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Lien Vendre */}
            <Link
              href="/vendre"
              className="relative px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all text-sm font-medium"
            >
              🏪 Vendre
            </Link>

            {/* Lien Panier */}
            <Link
              href="/panier"
              className="relative px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all text-sm font-medium"
            >
              🛒 Panier
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg shadow-red-200 animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Autres liens */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all text-sm font-medium"
              >
                {item.label}
                {item.href === "/whatsapp" && unreadCount > 0 && isConnected && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg shadow-red-200 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            ))}
            
            {/* Bouton de thème */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all"
              aria-label="Basculer le thème"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}


