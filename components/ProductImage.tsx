// components/ProductImage.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function ProductImage({
  src,
  alt,
  className = "w-full h-48 object-cover rounded-lg",
  width = 400,
  height = 400,
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(
    src && src.length > 0 ? src : "/images/placeholder.svg"
  );

  const handleError = () => {
    setImgSrc("/images/placeholder.svg");
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      loading="lazy"
      unoptimized={imgSrc.includes("unsplash.com") || imgSrc.includes("picsum.photos")}
    />
  );
}
