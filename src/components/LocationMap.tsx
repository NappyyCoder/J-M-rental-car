import { MAPS_EMBED_URL } from '../lib/contact'

type Props = {
  compact?: boolean
}

export function LocationMap({ compact = false }: Props) {
  return (
    <div className={`location-map${compact ? ' location-map--compact' : ''}`}>
      <iframe
        title="J&M Car Rental location"
        src={MAPS_EMBED_URL}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  )
}
