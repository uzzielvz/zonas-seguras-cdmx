import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { Delito } from '../../types/map'

interface SafetyZonesLayerProps {
  delitos: Delito[]
  enabled: boolean
  gridSize?: number // Tamaño de celda en grados (0.01 ≈ 1km)
}

// Clasificar nivel de seguridad según densidad de delitos
function clasificarSeguridad(delitosPorKm2: number): {
  nivel: 'muy_seguro' | 'seguro' | 'moderado' | 'peligroso' | 'muy_peligroso'
  color: string
  opacidad: number
} {
  if (delitosPorKm2 === 0) {
    return { nivel: 'muy_seguro', color: '#22c55e', opacidad: 0.6 } // Verde
  } else if (delitosPorKm2 < 5) {
    return { nivel: 'seguro', color: '#84cc16', opacidad: 0.5 } // Verde claro
  } else if (delitosPorKm2 < 15) {
    return { nivel: 'moderado', color: '#eab308', opacidad: 0.4 } // Amarillo
  } else if (delitosPorKm2 < 30) {
    return { nivel: 'peligroso', color: '#f97316', opacidad: 0.5 } // Naranja
  } else {
    return { nivel: 'muy_peligroso', color: '#ef4444', opacidad: 0.6 } // Rojo
  }
}

export default function SafetyZonesLayer({
  delitos,
  enabled,
  gridSize = 0.01, // ~1km
}: SafetyZonesLayerProps) {
  const map = useMap()

  useEffect(() => {
    if (!enabled || delitos.length === 0) {
      return
    }

    console.log('🛡️ Generando zonas de seguridad con', delitos.length, 'delitos')

    // Crear grid de celdas para toda CDMX (no solo el viewport actual)
    // Bounds aproximados de CDMX
    const cdmxBounds = {
      minLat: 19.0,
      maxLat: 19.7,
      minLng: -99.4,
      maxLng: -98.9,
    }

    // Crear grid de celdas
    const celdas = new Map<string, { delitos: number; lat: number; lng: number }>()

    // Contar delitos por celda
    delitos.forEach((delito) => {
      const lat = delito.coordenadas[0]
      const lng = delito.coordenadas[1]

      // Solo procesar delitos dentro de CDMX
      if (lat < cdmxBounds.minLat || lat > cdmxBounds.maxLat || 
          lng < cdmxBounds.minLng || lng > cdmxBounds.maxLng) {
        return
      }

      // Calcular celda
      const celdaLat = Math.floor(lat / gridSize) * gridSize
      const celdaLng = Math.floor(lng / gridSize) * gridSize
      const celdaKey = `${celdaLat}_${celdaLng}`

      if (!celdas.has(celdaKey)) {
        celdas.set(celdaKey, { delitos: 0, lat: celdaLat, lng: celdaLng })
      }
      celdas.get(celdaKey)!.delitos++
    })

    // Crear polígonos para cada celda
    const layers: L.Rectangle[] = []

    celdas.forEach((celda) => {
      // Calcular densidad (delitos por km² aproximado)
      // 1 grado de latitud ≈ 111 km
      // 1 grado de longitud ≈ 111 km * cos(latitud)
      const latRad = (celda.lat * Math.PI) / 180
      const areaKm2 = (gridSize * 111) * (gridSize * 111 * Math.cos(latRad))
      const densidad = areaKm2 > 0 ? celda.delitos / areaKm2 : 0

      const seguridad = clasificarSeguridad(densidad)

      // Crear polígono de la celda
      const polygon = L.rectangle(
        [
          [celda.lat, celda.lng],
          [celda.lat + gridSize, celda.lng + gridSize],
        ],
        {
          color: seguridad.color,
          fillColor: seguridad.color,
          fillOpacity: seguridad.opacidad,
          weight: 0,
          interactive: true,
        }
      )

      // Tooltip con información
      const nivelTexto = seguridad.nivel
        .replace('_', ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')

      polygon.bindTooltip(
        `<div style="text-align: center;">
          <strong>${nivelTexto}</strong><br>
          ${celda.delitos} delitos<br>
          ${densidad.toFixed(1)} delitos/km²
        </div>`,
        { permanent: false, direction: 'top', className: 'safety-zone-tooltip' }
      )

      polygon.addTo(map)
      layers.push(polygon)
    })

    console.log(`✅ ${layers.length} zonas de seguridad creadas`)

    return () => {
      layers.forEach((layer) => {
        map.removeLayer(layer)
      })
    }
  }, [map, delitos, enabled, gridSize])

  return null
}

