import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import CdmxBoundary from './CdmxBoundary'

// Fix para iconos de Leaflet en React
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Coordenadas de CDMX (centro)
const CDMX_CENTER: [number, number] = [19.4326, -99.1332]
const DEFAULT_ZOOM = 11

function MapController() {
  const map = useMap()

  useEffect(() => {
    // Centrar en CDMX al cargar
    map.setView(CDMX_CENTER, DEFAULT_ZOOM)
  }, [map])

  return null
}

export default function MapView() {
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
        <CdmxBoundary />
        
        {/* Aquí se agregarán las capas de calor, buffers y marcadores */}
      </MapContainer>
      
      {/* Controles flotantes */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-2 space-y-2">
        <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
          Mapa de Calor
        </button>
        <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
          Buffers de Riesgo
        </button>
        <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
          Mi Ubicación
        </button>
      </div>
    </div>
  )
}

