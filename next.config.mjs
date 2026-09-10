/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Désactive l'optimisation d'image de Next.js
  // Cela évite les erreurs de configuration (remotePatterns, etc.)
  // et est parfait pour les images provenant de sources externes.
  images: {
    unoptimized: true,
  },
  // On retire la clé "eslint" qui générait un avertissement.
};

export default nextConfig;
