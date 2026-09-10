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
  const [imgSrc, setImgSrc] = useState(src || "/images/placeholder.png");
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      src={hasError ? "/images/placeholder.png" : imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc("/images/placeholder.png");
        }
      }}
      loading="lazy"
      unoptimized={imgSrc.includes("unsplash.com") || imgSrc.includes("picsum.photos")}
    />
  );
}
