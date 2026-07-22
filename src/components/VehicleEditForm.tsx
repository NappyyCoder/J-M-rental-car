import { useEffect, useState, type FormEvent } from 'react'
import { STOCK_VEHICLE_PHOTOS } from '../lib/demoFleetSeed'
import { vehicleFallback } from '../lib/assets'
import { prepareImageFile } from '../lib/vehicles'
import type { Vehicle, VehicleCategory, VehicleInput, VehiclePackage } from '../types'
import { SafeImage } from './SafeImage'

type Props = {
  vehicle: Vehicle
  disabled?: boolean
  onSave: (input: VehicleInput, image?: File | string) => Promise<string | void>
}

export function vehicleToInput(vehicle: Vehicle): VehicleInput {
  return {
    name: vehicle.name,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    category: vehicle.category,
    package: vehicle.package,
    dailyRate: vehicle.dailyRate,
    seats: vehicle.seats,
    transmission: vehicle.transmission,
  }
}

export function VehicleEditForm({ vehicle, disabled = false, onSave }: Props) {
  const [form, setForm] = useState<VehicleInput>(() => vehicleToInput(vehicle))
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [stockImage, setStockImage] = useState('')
  const [previewUrl, setPreviewUrl] = useState(vehicle.imageUrl)
  const [drag, setDrag] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setPreviewUrl(vehicle.imageUrl)
  }, [vehicle.imageUrl])

  async function onFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMsg('Please upload an image file.')
      return
    }
    setBusy(true)
    try {
      const prepared = await prepareImageFile(file)
      setImageFile(prepared)
      setStockImage('')
      setPreviewUrl(URL.createObjectURL(prepared))
      setMsg('')
    } catch {
      setMsg('Could not process that image.')
    } finally {
      setBusy(false)
    }
  }

  function onStockPhoto(url: string, category: VehicleCategory) {
    setStockImage(url)
    setImageFile(null)
    setPreviewUrl(url)
    setForm((prev) => ({ ...prev, category }))
    setMsg('')
  }

  function onResetPhoto() {
    setImageFile(null)
    setStockImage('')
    setPreviewUrl(vehicle.imageUrl)
    setMsg('')
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    try {
      const newImage = (imageFile ?? stockImage) || undefined
      const savedImageUrl = await onSave(form, newImage)
      setImageFile(null)
      setStockImage('')
      if (savedImageUrl) {
        setPreviewUrl(savedImageUrl)
      }
      setMsg('Changes saved. The live site is updated.')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not save changes.')
    } finally {
      setBusy(false)
    }
  }

  const photoChanged = Boolean(imageFile || stockImage)

  return (
    <form className="admin-form vehicle-edit-form" onSubmit={(e) => void onSubmit(e)}>
      <p className="avail-editor-label">Edit vehicle details</p>
      <p className="vehicle-edit-note">
        Fix spelling, pricing, package, or photo. Changes go live immediately.
      </p>

      <div className="field">
        <label htmlFor={`edit-name-${vehicle.id}`}>Nickname (optional)</label>
        <input
          id={`edit-name-${vehicle.id}`}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Silver Camry"
        />
      </div>
      <div className="row-2">
        <div className="field">
          <label htmlFor={`edit-make-${vehicle.id}`}>Make</label>
          <input
            id={`edit-make-${vehicle.id}`}
            required
            value={form.make}
            onChange={(e) => setForm({ ...form, make: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor={`edit-model-${vehicle.id}`}>Model</label>
          <input
            id={`edit-model-${vehicle.id}`}
            required
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
          />
        </div>
      </div>
      <div className="row-2">
        <div className="field">
          <label htmlFor={`edit-year-${vehicle.id}`}>Year</label>
          <input
            id={`edit-year-${vehicle.id}`}
            type="number"
            required
            min={1995}
            max={2100}
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label htmlFor={`edit-category-${vehicle.id}`}>Vehicle type</label>
          <select
            id={`edit-category-${vehicle.id}`}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as VehicleCategory })}
          >
            <option value="economy">Economy</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
          </select>
        </div>
      </div>
      <div className="row-2">
        <div className="field">
          <label htmlFor={`edit-package-${vehicle.id}`}>Package</label>
          <select
            id={`edit-package-${vehicle.id}`}
            value={form.package}
            onChange={(e) => setForm({ ...form, package: e.target.value as VehiclePackage })}
          >
            <option value="gold">Gold (premium)</option>
            <option value="silver">Silver (standard)</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor={`edit-rate-${vehicle.id}`}>Daily rate ($)</label>
          <input
            id={`edit-rate-${vehicle.id}`}
            type="number"
            required
            min={1}
            value={form.dailyRate}
            onChange={(e) => setForm({ ...form, dailyRate: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="row-2">
        <div className="field">
          <label htmlFor={`edit-seats-${vehicle.id}`}>Seats</label>
          <input
            id={`edit-seats-${vehicle.id}`}
            type="number"
            required
            min={2}
            max={15}
            value={form.seats}
            onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label htmlFor={`edit-trans-${vehicle.id}`}>Transmission</label>
          <select
            id={`edit-trans-${vehicle.id}`}
            value={form.transmission}
            onChange={(e) =>
              setForm({
                ...form,
                transmission: e.target.value as 'automatic' | 'manual',
              })
            }
          >
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      </div>

      <div className="field">
        <span className="field-label">Photo</span>
        <div className="vehicle-edit-photo-current">
          <img
            className="vehicle-edit-photo-preview"
            src={previewUrl}
            alt=""
            onError={(e) => {
              e.currentTarget.src = vehicleFallback(form.category)
            }}
          />
          {photoChanged && (
            <button type="button" className="btn btn-sm btn-outline" onClick={onResetPhoto}>
              Keep original photo
            </button>
          )}
        </div>
        <div className="stock-photo-grid stock-photo-grid--compact">
          {STOCK_VEHICLE_PHOTOS.map((photo) => (
            <button
              key={photo.url}
              type="button"
              className={`stock-photo-btn${stockImage === photo.url ? ' active' : ''}`}
              onClick={() => onStockPhoto(photo.url, photo.category)}
            >
              <SafeImage src={photo.url} alt={photo.label} fallbackCategory={photo.category} />
              <span>{photo.label}</span>
            </button>
          ))}
        </div>
        <label
          className={`file-drop file-drop--compact${drag ? ' is-dragging' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDrag(false)
            void onFile(e.dataTransfer.files[0])
          }}
        >
          {busy ? 'Processing photo…' : 'Upload a new photo (optional)'}
          <input type="file" accept="image/*" onChange={(e) => void onFile(e.target.files?.[0])} />
        </label>
      </div>

      {msg && <p className={`vehicle-edit-msg${msg.includes('saved') ? ' success' : ''}`}>{msg}</p>}

      <button type="submit" className="btn btn-primary btn-block" disabled={disabled || busy}>
        {busy ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
