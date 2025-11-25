import { useState, useRef, useEffect } from 'react'
import { XMarkIcon, MapPinIcon, CameraIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline'
import IconRobo from '../Icons/IconRobo'
import IconAsalto from '../Icons/IconAsalto'
import IconHomicidio from '../Icons/IconHomicidio'
import IconAcoso from '../Icons/IconAcoso'
import IconOtro from '../Icons/IconOtro'
import { ReporteCiudadano, Coordinates } from '../../types/map'

interface ReportFormProps {
  isOpen: boolean
  onClose: () => void
  onReportSubmit: (reporte: ReporteCiudadano) => void
  initialCoordinates?: Coordinates
  onGetLocation?: () => void
  onSelectOnMap?: () => void
}

type TipoReporte = 'robo' | 'asalto' | 'homicidio' | 'acoso' | 'otro'

const tiposReporte: { value: TipoReporte; label: string; icon: React.ComponentType<{ className?: string; size?: number }> }[] = [
  { value: 'robo', label: 'Robo', icon: IconRobo },
  { value: 'asalto', label: 'Asalto', icon: IconAsalto },
  { value: 'homicidio', label: 'Homicidio', icon: IconHomicidio },
  { value: 'acoso', label: 'Acoso', icon: IconAcoso },
  { value: 'otro', label: 'Otro', icon: IconOtro },
]

export default function ReportForm({
  isOpen,
  onClose,
  onReportSubmit,
  initialCoordinates,
  onGetLocation,
  onSelectOnMap,
}: ReportFormProps) {
  const [tipo, setTipo] = useState<TipoReporte>('robo')
  const [descripcion, setDescripcion] = useState('')
  const [foto, setFoto] = useState<string | null>(null)
  const [coordenadas, setCoordenadas] = useState<Coordinates | null>(initialCoordinates || null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Actualizar coordenadas cuando initialCoordinates cambie (clic en el mapa)
  useEffect(() => {
    if (initialCoordinates) {
      setCoordenadas(initialCoordinates)
      setError('')
    }
  }, [initialCoordinates])

  // Resetear formulario cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      setTipo('robo')
      setDescripcion('')
      setFoto(null)
      setCoordenadas(null)
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen es demasiado grande (máximo 5MB)')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFoto(reader.result as string)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!coordenadas) {
      setError('Por favor, selecciona una ubicación en el mapa o usa tu geolocalización')
      return
    }

    const nuevoReporte: ReporteCiudadano = {
      id: `reporte-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tipo,
      coordenadas,
      fecha: new Date().toISOString(),
      descripcion: descripcion.trim() || undefined,
      foto: foto || undefined,
      verificado: false,
    }

    onReportSubmit(nuevoReporte)
    
    // Reset form
    setTipo('robo')
    setDescripcion('')
    setFoto(null)
    setCoordenadas(initialCoordinates || null)
    setError('')
    onClose()
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordenadas([position.coords.latitude, position.coords.longitude])
          setError('')
          if (onGetLocation) {
            onGetLocation()
          }
        },
        () => {
          setError('No se pudo obtener tu ubicación. Por favor, haz clic en el mapa.')
        }
      )
    } else {
      setError('Tu navegador no soporta geolocalización. Por favor, haz clic en el mapa.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Reportar Incidente</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Tipo de delito */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de incidente *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {tiposReporte.map((tipoOption) => {
                const Icon = tipoOption.icon
                return (
                  <button
                    key={tipoOption.value}
                    type="button"
                    onClick={() => setTipo(tipoOption.value)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      tipo === tipoOption.value
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">{tipoOption.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación *
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleGetLocation}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <MapPinIcon className="w-5 h-5" />
                Mi ubicación
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSelectOnMap) {
                    onSelectOnMap()
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <CursorArrowRaysIcon className="w-5 h-5" />
                Seleccionar en el mapa
              </button>
              {coordenadas && (
                <div className="flex-1 min-w-[200px] px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                  {coordenadas[0].toFixed(6)}, {coordenadas[1].toFixed(6)}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Haz clic en el mapa para seleccionar la ubicación exacta
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Describe brevemente lo que ocurrió..."
            />
          </div>

          {/* Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto (opcional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CameraIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">
                {foto ? 'Cambiar foto' : 'Subir foto'}
              </span>
            </button>
            {foto && (
              <div className="mt-2">
                <img
                  src={foto}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Reportar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

