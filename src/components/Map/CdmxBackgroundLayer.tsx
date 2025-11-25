import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
// @ts-ignore
import * as turf from '@turf/turf'
import { Delito } from '../../types/map'

interface CdmxBackgroundLayerProps {
  delitos: Delito[]
  enabled?: boolean
  gridSize?: number
}

export default function CdmxBackgroundLayer({
  delitos,
  enabled = true,
  gridSize = 0.01, // ~1km
}: CdmxBackgroundLayerProps) {
  const map = useMap()

  useEffect(() => {
    if (!enabled) {
      // Remover todas las capas de fondo si está deshabilitado
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Rectangle && layer.options.className === 'cdmx-background-cell') {
          map.removeLayer(layer)
        }
      })
      return
    }

    // Cargar el polígono de CDMX
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
        const celdasConDelitos = new Set<string>()
        
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
          
          celdasConDelitos.add(celdaKey)
        })

        // Crear grid completo de CDMX
        const layers: L.Rectangle[] = []
        const latRad = (19.35 * Math.PI) / 180 // Latitud promedio de CDMX
        const kmPorGradoLat = 111
        const kmPorGradoLng = 111 * Math.cos(latRad)
        const areaKm2 = (gridSize * kmPorGradoLat) * (gridSize * kmPorGradoLng)

        // Generar celdas del grid (optimizado: solo verificar puntos cada 2 celdas)
        const step = gridSize * 2 // Reducir densidad para mejor rendimiento
        let celdaCount = 0
        
        for (let lat = cdmxBounds.minLat; lat < cdmxBounds.maxLat; lat += step) {
          for (let lng = cdmxBounds.minLng; lng < cdmxBounds.maxLng; lng += step) {
            const celdaLat = Math.floor(lat / gridSize) * gridSize
            const celdaLng = Math.floor(lng / gridSize) * gridSize
            const celdaKey = `${celdaLat}_${celdaLng}`
            
            // Solo crear celdas que NO tienen delitos
            if (!celdasConDelitos.has(celdaKey)) {
              // Verificar si la celda está dentro del polígono de CDMX
              const celdaCenter = [celdaLng + gridSize / 2, celdaLat + gridSize / 2]
              const point = turf.point(celdaCenter)
              
              // Verificar si el punto está dentro del polígono
              if (turf.booleanPointInPolygon(point, union)) {
                // Crear rectángulo para la celda
                const bounds = L.latLngBounds(
                  [celdaLat, celdaLng],
                  [celdaLat + gridSize, celdaLng + gridSize]
                )

                const rectangle = L.rectangle(bounds, {
                  fillColor: '#e5e7eb', // Gris claro - sin datos
                  fillOpacity: 0.25, // Más transparente para no competir con el mapa de calor
                  color: '#d1d5db', // Borde gris más oscuro
                  weight: 0.3,
                  opacity: 0.15,
                  className: 'cdmx-background-cell',
                })

                rectangle.addTo(map)
                layers.push(rectangle)
                celdaCount++
              }
            }
          }
        }

        console.log(`🗺️ Zonas sin datos: ${celdaCount} celdas mostradas (gris claro)`)

        return () => {
          layers.forEach((layer) => {
            map.removeLayer(layer)
          })
        }
      })
      .catch((error) => {
        console.error('Error cargando fondo de CDMX:', error)
      })
  }, [map, delitos, enabled, gridSize])

  return null
}

