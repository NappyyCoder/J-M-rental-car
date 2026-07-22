type Props = {
  className?: string
  variant?: 'header' | 'footer'
}

export function Logo({ className = '', variant = 'header' }: Props) {
  const label = variant === 'footer' ? 'J&M Car Rental' : 'J&M Car Rental home'

  return (
    <svg
      className={`brand-logo${className ? ` ${className}` : ''}`}
      viewBox="0 0 280 72"
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="140"
        y="45"
        textAnchor="middle"
        className="brand-logo-mark"
        fontSize="48"
        fontWeight="700"
        fill="currentColor"
      >
        J&amp;M
      </text>
      <text
        x="140"
        y="68"
        textAnchor="middle"
        className="brand-logo-sub"
        fontSize="16.5"
        fontWeight="700"
        fontStyle="italic"
        letterSpacing="0.16em"
        fill="currentColor"
      >
        CAR RENTAL
      </text>
    </svg>
  )
}
