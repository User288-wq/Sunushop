"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">🌴 SunuShop</h3>
            <p className="text-sm text-gray-400">
              La marketplace sénégalaise qui connecte les vendeurs et les acheteurs.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://wa.me/221773509559" className="text-gray-400 hover:text-green-400 transition">
                💬
              </a>
              <a href="https://www.tiktok.com/@sunushop" className="text-gray-400 hover:text-white transition">
                🎵
              </a>
              <a href="https://www.facebook.com/sunushop" className="text-gray-400 hover:text-blue-400 transition">
                📘
              </a>
              <a href="https://www.instagram.com/sunushop" className="text-gray-400 hover:text-pink-400 transition">
                📸
              </a>
              <a href="https://twitter.com/sunushop" className="text-gray-400 hover:text-sky-400 transition">
                🐦
              </a>
            </div>
          </div>

          {/* Liens */}
          <div>
            <h4 className="text-white font-medium mb-4">Liens</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-green-400 transition">Accueil</Link></li>
              <li><Link href="/vendre" className="hover:text-green-400 transition">Vendre</Link></li>
              <li><Link href="/preinscription" className="hover:text-green-400 transition">Pré-inscription</Link></li>
              <li><Link href="/expansion" className="hover:text-green-400 transition">Expansion</Link></li>
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h4 className="text-white font-medium mb-4">Aide</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://wa.me/221773509559" className="hover:text-green-400 transition">Support WhatsApp</a></li>
              <li><Link href="/faq" className="hover:text-green-400 transition">FAQ</Link></li>
              <li><Link href="/conditions" className="hover:text-green-400 transition">CGV</Link></li>
              <li><Link href="/confidentialite" className="hover:text-green-400 transition">Confidentialité</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span>📱</span>
                <a href="tel:+221773509559" className="hover:text-green-400 transition">+221 77 350 95 59</a>
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:support@sunu-shop.org" className="hover:text-green-400 transition">support@sunu-shop.org</a>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Dakar, Sénégal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {currentYear} SunuShop. Tous droits réservés.</p>
          <p className="mt-1">Fait avec ❤️ au Sénégal</p>
        </div>
      </div>
    </footer>
  );
}
