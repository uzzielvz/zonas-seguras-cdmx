import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { FireIcon, ShieldExclamationIcon, MapPinIcon } from '@heroicons/react/24/outline'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import CdmxBoundary from './CdmxBoundary'
import ReportMarkers from './ReportMarkers'
import MapClickHandler from './MapClickHandler'
import HeatmapLayer from './HeatmapLayer'
import SafetyZonesLayer from './SafetyZonesLayer'
import { ReporteCiudadano, Coordinates, FiltrosMapa, Delito } from '../../types/map'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CDMX_CENTER: [number, number] = [19.4326, -99.1332]
const DEFAULT_ZOOM = 11

function MapController() {
  const map = useMap()

  useEffect(() => {
    map.setView(CDMX_CENTER, DEFAULT_ZOOM)
  }, [map])

  return null
}

interface MapViewProps {
  reportes: ReporteCiudadano[]
  onMapClick?: (coords: Coordinates) => void
  mapClickEnabled?: boolean
  mapSelectionMode?: boolean
  onDeleteReport?: (id: string) => void
  filtros?: FiltrosMapa
  heatmapData?: Array<[number, number, number]>
  calorIntensidad?: number
  delitos?: Delito[]
}

function SelectionZoomController({ enabled }: { enabled: boolean }) {
  const map = useMap()
  
  useEffect(() => {
    if (enabled) {
      const currentZoom = map.getZoom()
      if (currentZoom < 15) {
        map.setZoom(15, { animate: true, duration: 0.5 })
      }
    }
  }, [enabled, map])
  
  return null
}

export default function MapView({ 
  reportes, 
  onMapClick, 
  mapClickEnabled = false,
  mapSelectionMode = false,
  onDeleteReport,
  filtros,
  heatmapData = [],
  calorIntensidad = 50,
  delitos = []
}: MapViewProps) {
  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={CDMX_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController />
        {mapSelectionMode && <SelectionZoomController enabled={mapSelectionMode} />}
        <CdmxBoundary />
        <ReportMarkers reportes={reportes} onDeleteReport={onDeleteReport} />
        {filtros?.mostrarCalor === true && heatmapData.length > 0 && (
          <HeatmapLayer 
            data={heatmapData} 
            enabled={true}
            radius={20}
            blur={12}
            intensidad={calorIntensidad || 50}
          />
        )}
        {filtros?.mostrarZonasSeguridad === true && delitos.length > 0 && (
          <SafetyZonesLayer 
            delitos={delitos}
            enabled={true}
            gridSize={0.01}
          />
        )}
        {onMapClick && <MapClickHandler onMapClick={onMapClick} enabled={mapClickEnabled} />}
      </MapContainer>
      
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button 
          className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center hover:bg-white"
          title="Mapa de calor"
        >
          <FireIcon className="w-5 h-5 text-gray-700" />
        </button>
        <button 
          className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center hover:bg-white"
          title="Zonas de riesgo"
        >
          <ShieldExclamationIcon className="w-5 h-5 text-gray-700" />
        </button>
        <button 
          className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center hover:bg-white"
          title="Mi ubicación"
        >
          <MapPinIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  )
}

