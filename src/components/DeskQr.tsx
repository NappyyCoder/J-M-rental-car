import { useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'

type Props = {
  path: string
  label?: string
}

export function DeskQr({ path, label }: Props) {
  const url = useMemo(() => `${window.location.origin}${path}`, [path])

  return (
    <div className="sign-qr">
      <QRCodeSVG value={url} size={160} level="M" fgColor="#1a1917" bgColor="#ffffff" />
      <p>
        {label ?? 'Scan to open on your phone'}
        <span>{url}</span>
      </p>
    </div>
  )
}
