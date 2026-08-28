"use client";

interface SocialShareProps {
  product: {
    title: string;
    price: number;
    productUrl: string;
  };
}

export default function SocialButtons({ product }: SocialShareProps) {
  const shareData = {
    text: encodeURIComponent(`${product.title} - ${product.price.toLocaleString()} FCFA\n\nDécouvrez ce produit sur SunuShop !`),
    url: encodeURIComponent(product.productUrl),
  };

  const socialLinks = [
    {
      name: "TikTok",
      icon: "/icons/tiktok.svg",
      url: `https://www.tiktok.com/share/video?text=${shareData.text}&url=${shareData.url}`,
      color: "bg-black hover:bg-gray-800",
    },
    {
      name: "WhatsApp",
      icon: "/icons/whatsapp.svg",
      url: `https://wa.me/?text=${shareData.text}%20${shareData.url}`,
      color: "bg-[#25D366] hover:bg-[#128C7E]",
    },
    {
      name: "X",
      icon: "/icons/x.svg",
      url: `https://twitter.com/intent/tweet?text=${shareData.text}&url=${shareData.url}`,
      color: "bg-black hover:bg-gray-800",
    },
    {
      name: "Instagram",
      icon: "/icons/instagram.svg",
      url: `https://www.instagram.com/create/story?text=${shareData.text}`,
      color: "bg-gradient-to-r from-[#405DE6] via-[#5851DB] to-[#E4405F] hover:opacity-90",
    },
    {
      name: "Facebook",
      icon: "/icons/facebook.svg",
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}&quote=${shareData.text}`,
      color: "bg-[#1877F2] hover:bg-[#166FE5]",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(product.productUrl);
    alert("✅ Lien copié dans le presse-papiers !");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        📱 Partager sur les réseaux sociaux
      </p>
      <div className="flex flex-wrap gap-3">
        {socialLinks.map((social) => (
          <button
            key={social.name}
            onClick={() => window.open(social.url, "_blank")}
            className={`${social.color} text-white px-4 py-2 rounded-lg hover:shadow-lg transition flex items-center gap-2 text-sm font-medium`}
          >
            <img src={social.icon} alt={social.name} className="w-5 h-5 invert" />
            <span>{social.name}</span>
          </button>
        ))}
        <button
          onClick={copyToClipboard}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:shadow-lg transition flex items-center gap-2 text-sm font-medium"
        >
          📋 Copier le lien
        </button>
      </div>
    </div>
  );
}
