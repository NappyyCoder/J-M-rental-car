import { useState } from 'react'
import type { VehicleCategory } from '../types'
import { vehicleFallback } from '../lib/assets'

type Props = {
  src?: string
  alt: string
  className?: string
  fallbackCategory?: VehicleCategory
  fallbackSrc?: string
}

export function SafeImage({
  src,
  alt,
  className,
  fallbackCategory,
  fallbackSrc,
}: Props) {
  const fallback = fallbackSrc ?? vehicleFallback(fallbackCategory)
  const [activeSrc, setActiveSrc] = useState(src?.trim() || fallback)

  return (
    <img
      className={className}
      src={activeSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (activeSrc !== fallback) setActiveSrc(fallback)
      }}
    />
  )
}
