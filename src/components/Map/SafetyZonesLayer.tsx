import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
// @ts-ignore
import * as turf from '@turf/turf'
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
    // Si está deshabilitado, remover todas las capas de zonas de seguridad
    if (!enabled) {
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Rectangle && layer.options.fillColor) {
          // Verificar si es una zona de seguridad por el color
          const colors = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444']
          if (colors.includes(layer.options.fillColor)) {
            map.removeLayer(layer)
          }
        }
      })
      return
    }

    if (delitos.length === 0) {
      return
    }

    console.log('🛡️ Generando zonas de seguridad con', delitos.length, 'delitos')

    // Cargar el polígono de CDMX para verificar qué celdas están dentro
    fetch('/data/limite-de-las-alcaldas.json')
      .then((response) => response.json())
      .then((data) => {
        if (!data.features || data.features.length === 0) {
          return
        }

        // Filtrar solo polígonos
        const polygons = data.features.filter((f: any) => 
          f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')
        )

        if (polygons.length === 0) {
          return
        }

        // Unir todos los polígonos para obtener el límite exterior
        let union: any = null

        for (const feature of polygons) {
          let polygon: any
          
          if (feature.geometry.type === 'Polygon') {
            polygon = turf.polygon(feature.geometry.coordinates)
          } else if (feature.geometry.type === 'MultiPolygon') {
            for (const coords of feature.geometry.coordinates) {
              polygon = turf.polygon(coords)
              if (!union) {
                union = polygon
              } else {
                union = turf.union(union, polygon)
              }
            }
            continue
          }

          if (!union) {
            union = polygon
          } else {
            union = turf.union(union, polygon)
          }
        }

        if (!union || !union.geometry) {
          return
        }

        // Bounds aproximados de CDMX
        const cdmxBounds = {
          minLat: 19.0,
          maxLat: 19.7,
          minLng: -99.4,
          maxLng: -98.9,
        }

        // Crear grid de celdas con delitos
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

        // Generar grid completo de CDMX (incluyendo zonas sin delitos)
        const step = gridSize
        for (let lat = cdmxBounds.minLat; lat < cdmxBounds.maxLat; lat += step) {
          for (let lng = cdmxBounds.minLng; lng < cdmxBounds.maxLng; lng += step) {
            const celdaLat = Math.floor(lat / gridSize) * gridSize
            const celdaLng = Math.floor(lng / gridSize) * gridSize
            const celdaKey = `${celdaLat}_${celdaLng}`

            // Verificar si la celda está dentro del polígono de CDMX
            const celdaCenter = [celdaLng + gridSize / 2, celdaLat + gridSize / 2]
            const point = turf.point(celdaCenter)
            
            if (!turf.booleanPointInPolygon(point, union)) {
              continue // Saltar celdas fuera de CDMX
            }

            // Obtener datos de la celda (0 delitos si no existe)
            const celda = celdas.get(celdaKey) || { delitos: 0, lat: celdaLat, lng: celdaLng }

            // Calcular densidad (delitos por km² aproximado)
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
          }
        }

        console.log(`✅ ${layers.length} zonas de seguridad creadas (incluyendo zonas sin delitos en verde)`)

        return () => {
          layers.forEach((layer) => {
            map.removeLayer(layer)
          })
        }
      })
      .catch((error) => {
        console.error('Error cargando límites de CDMX para zonas de seguridad:', error)
      })
  }, [map, delitos, enabled, gridSize])

  return null
}

