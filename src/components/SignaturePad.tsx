import { useEffect, useRef } from 'react'
import SignaturePadLib from 'signature_pad'

type Props = {
  onChange: (dataUrl: string | null) => void
}

export function SignaturePad({ onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const padRef = useRef<SignaturePadLib | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const pad = new SignaturePadLib(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(26, 25, 23)',
    })
    padRef.current = pad

    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      const rect = canvas.getBoundingClientRect()
      const data = pad.isEmpty() ? null : pad.toData()
      canvas.width = rect.width * ratio
      canvas.height = rect.height * ratio
      canvas.getContext('2d')?.scale(ratio, ratio)
      pad.clear()
      if (data) pad.fromData(data)
    }

    resize()
    window.addEventListener('resize', resize)

    const handleEnd = () => {
      onChange(pad.isEmpty() ? null : pad.toDataURL('image/png'))
    }
    canvas.addEventListener('pointerup', handleEnd)
    canvas.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointerup', handleEnd)
      canvas.removeEventListener('touchend', handleEnd)
      pad.off()
      padRef.current = null
    }
  }, [onChange])

  return (
    <div className="sign-pad">
      <div className="sign-pad-frame">
        <canvas ref={canvasRef} className="sign-pad-canvas" />
      </div>
      <button
        type="button"
        className="text-link"
        onClick={() => {
          padRef.current?.clear()
          onChange(null)
        }}
      >
        Clear signature
      </button>
    </div>
  )
}
