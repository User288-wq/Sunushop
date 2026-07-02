'use client';
import { Share2, Send } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

// Icônes SVG personnalisées
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function ShareButtons({ url, title, description = '', className = '' }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const fullText = `${title} - ${url}`;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
  };

  const copyToClipboard = (message?: string) => {
    navigator.clipboard.writeText(url);
    alert(message || 'Lien copié dans le presse-papier !');
  };

  const shareInstagram = () => {
    navigator.clipboard.writeText(url);
    alert('📸 Lien copié ! Collez-le dans votre story ou message Instagram.');
  };

  const shareTikTok = () => {
    navigator.clipboard.writeText(fullText);
    alert('🎵 Texte copié ! Collez-le dans la description de votre vidéo TikTok.');
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button onClick={() => window.open(shareLinks.whatsapp, '_blank')} className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition">
        <Send size={18} /> WhatsApp
      </button>
      <button onClick={() => window.open(shareLinks.facebook, '_blank')} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition">
        <FacebookIcon /> Facebook
      </button>
      <button onClick={() => window.open(shareLinks.twitter, '_blank')} className="flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-900 transition">
        <TwitterIcon /> Twitter
      </button>
      <button onClick={shareTikTok} className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition">
        <TikTokIcon /> TikTok
      </button>
      <button onClick={shareInstagram} className="flex items-center gap-2 bg-pink-600 text-white px-3 py-2 rounded-lg hover:bg-pink-700 transition">
        <InstagramIcon /> Instagram
      </button>
      <button onClick={() => copyToClipboard()} className="flex items-center gap-2 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition">
        📋 Copier
      </button>
    </div>
  );
}
