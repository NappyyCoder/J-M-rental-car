import { useEffect, useState } from 'react'
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
  const resolved = src?.trim() || fallback
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    setUseFallback(false)
  }, [resolved])

  return (
    <img
      className={className}
      src={useFallback ? fallback : resolved}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (!useFallback) setUseFallback(true)
      }}
    />
  )
}
