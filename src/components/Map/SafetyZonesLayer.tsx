import { useEffect, useState } from 'react'
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
  const [cdmxPolygon, setCdmxPolygon] = useState<any>(null)

  // Cargar límites de CDMX una sola vez
  useEffect(() => {
    if (cdmxPolygon) return // Ya está cargado

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

        // Unir todos los polígonos para obtener el límite completo de CDMX
        let union: any = null

        for (const feature of polygons) {
          let polygon: any
          
          if (feature.geometry.type === 'Polygon') {
            polygon = turf.polygon(feature.geometry.coordinates)
          } else if (feature.geometry.type === 'MultiPolygon') {
            // Convertir MultiPolygon a Polygon(s)
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

        if (union) {
          setCdmxPolygon(union)
        }
      })
      .catch((error) => {
        console.error('Error cargando límites de CDMX:', error)
      })
  }, [cdmxPolygon])

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

    // Esperar a que se cargue el polígono de CDMX
    if (!cdmxPolygon) {
      return
    }

    console.log('🛡️ Generando zonas de seguridad con', delitos.length, 'delitos')

    // Bounds aproximados de CDMX para crear el grid
    const cdmxBounds = {
      minLat: 19.0,
      maxLat: 19.7,
      minLng: -99.4,
      maxLng: -98.9,
    }

    // Crear grid completo de celdas
    const celdas = new Map<string, { delitos: number; lat: number; lng: number }>()

    // Primero, crear todas las celdas posibles del grid
    for (let lat = cdmxBounds.minLat; lat < cdmxBounds.maxLat; lat += gridSize) {
      for (let lng = cdmxBounds.minLng; lng < cdmxBounds.maxLng; lng += gridSize) {
        const celdaLat = Math.floor(lat / gridSize) * gridSize
        const celdaLng = Math.floor(lng / gridSize) * gridSize
        const celdaKey = `${celdaLat}_${celdaLng}`

        // Centro de la celda para verificar si está dentro de CDMX
        const centroLat = celdaLat + gridSize / 2
        const centroLng = celdaLng + gridSize / 2
        const puntoCentro = turf.point([centroLng, centroLat])

        // Verificar si el centro de la celda está dentro de CDMX
        if (turf.booleanPointInPolygon(puntoCentro, cdmxPolygon)) {
          if (!celdas.has(celdaKey)) {
            celdas.set(celdaKey, { delitos: 0, lat: celdaLat, lng: celdaLng })
          }
        }
      }
    }

    // Ahora contar delitos por celda (solo en las celdas que ya están en el grid)
    delitos.forEach((delito) => {
      const lat = delito.coordenadas[0]
      const lng = delito.coordenadas[1]

      // Calcular celda
      const celdaLat = Math.floor(lat / gridSize) * gridSize
      const celdaLng = Math.floor(lng / gridSize) * gridSize
      const celdaKey = `${celdaLat}_${celdaLng}`

      // Solo contar si la celda está en el grid (dentro de CDMX)
      if (celdas.has(celdaKey)) {
        celdas.get(celdaKey)!.delitos++
      }
    })

    // Crear polígonos para cada celda (incluyendo las que tienen 0 delitos)
    const layers: L.Rectangle[] = []

    celdas.forEach((celda) => {
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
    })

    const celdasSinDelitos = Array.from(celdas.values()).filter(c => c.delitos === 0).length
    console.log(`✅ ${layers.length} zonas de seguridad creadas (${celdasSinDelitos} áreas sin delitos en verde)`)

    return () => {
      layers.forEach((layer) => {
        map.removeLayer(layer)
      })
    }
  }, [map, delitos, enabled, gridSize, cdmxPolygon])

  return null
}

