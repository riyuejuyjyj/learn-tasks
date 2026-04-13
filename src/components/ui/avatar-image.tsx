"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type AvatarImageProps = {
  src: string;
  alt: string;
  size: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
};

export function AvatarImage({
  src,
  alt,
  size,
  className,
  priority = false,
  fallbackSrc,
}: AvatarImageProps) {
  const normalizedSrc = src.trim();
  const normalizedFallbackSrc = fallbackSrc?.trim() || "";
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const currentSrc =
    failedSrc === normalizedSrc
      ? normalizedFallbackSrc || normalizedSrc
      : normalizedSrc || normalizedFallbackSrc;

  return (
    // Small remote avatars are more reliable as native images than through
    // Next's optimization pipeline, especially for external SVG and signed URLs.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      width={size}
      height={size}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => {
        if (normalizedSrc && currentSrc !== normalizedFallbackSrc) {
          setFailedSrc(normalizedSrc);
        }
      }}
      className={cn("object-cover", className)}
    />
  );
}
