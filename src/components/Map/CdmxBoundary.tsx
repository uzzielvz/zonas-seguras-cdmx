import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
// @ts-ignore
import * as turf from '@turf/turf'

function CdmxBoundary() {
  const map = useMap()

  useEffect(() => {
    // Cargar el JSON y unir todos los polígonos para obtener solo el límite exterior
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

        if (union && union.geometry && union.geometry.type === 'Polygon') {
          // Usar solo el anillo exterior (primer array de coordenadas)
          // Ignorar los anillos internos (agujeros)
          const exteriorRing = union.geometry.coordinates[0]
          
          // Crear un polígono simple con solo el anillo exterior
          const boundaryPolygon = turf.polygon([exteriorRing])
          
          // Crear GeoJSON con solo el límite exterior
          const boundaryGeoJson = {
            type: 'FeatureCollection',
            features: [boundaryPolygon],
          }

          // Crear la capa con solo el límite exterior
          const geoJsonLayer = L.geoJSON(boundaryGeoJson as any, {
            style: {
              color: '#ef4444',  // Rojo
              weight: 3,
              opacity: 0.8,
              fillColor: 'transparent',
              fillOpacity: 0,
            },
          })

          geoJsonLayer.addTo(map)

          // Ajustar el zoom
          const bounds = geoJsonLayer.getBounds()
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] })
          }

          return () => {
            map.removeLayer(geoJsonLayer)
          }
        }
      })
      .catch((error) => {
        console.error('Error cargando límites de CDMX:', error)
      })
  }, [map])

  return null
}

export default CdmxBoundary

