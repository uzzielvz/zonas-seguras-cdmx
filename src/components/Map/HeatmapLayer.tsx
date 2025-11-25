import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

// Importar leaflet.heat dinámicamente
let heatPluginLoaded = false

const loadHeatPlugin = async () => {
  if (heatPluginLoaded) return
  
  try {
    // @ts-ignore
    await import('leaflet.heat')
    heatPluginLoaded = true
    console.log('✅ leaflet.heat cargado')
  } catch (error) {
    console.error('❌ Error cargando leaflet.heat:', error)
  }
}

interface HeatmapLayerProps {
  data: Array<[number, number, number]> // [lat, lng, intensity]
  enabled: boolean
  radius?: number
  blur?: number
  maxZoom?: number
  max?: number
  minOpacity?: number
  intensidad?: number // 0-100 para ajustar opacidad e intensidad
}

export default function HeatmapLayer({
  data,
  enabled,
  radius = 20, // Reducido de 25 para menos densidad
  blur = 12, // Reducido de 15 para menos difusión
  maxZoom = 18,
  max = 1.0,
  minOpacity = 0.1, // Aumentado para mejor visibilidad
  intensidad = 50, // Intensidad por defecto
}: HeatmapLayerProps) {
  const map = useMap()

  useEffect(() => {
    let heatLayer: any = null

    // Si está deshabilitado o no hay datos, remover la capa si existe
    if (!enabled || data.length === 0) {
      // Buscar y remover cualquier capa de calor existente
      map.eachLayer((layer: any) => {
        if (layer._heat && layer._heat._latlngs) {
          map.removeLayer(layer)
        }
      })
      return
    }

    const initHeatmap = async () => {
      await loadHeatPlugin()
      
      // Verificar que leaflet.heat esté disponible
      if (!(L as any).heatLayer) {
        console.error('❌ leaflet.heat no está disponible después de cargar')
        return
      }

      // Remover cualquier capa de calor anterior
      map.eachLayer((layer: any) => {
        if (layer._heat && layer._heat._latlngs) {
          map.removeLayer(layer)
        }
      })

      console.log('🔥 Creando mapa de calor con', data.length, 'puntos')

      // Ajustar opacidad según intensidad (0-100 -> 0.1-0.8)
      const opacity = minOpacity + (intensidad / 100) * (0.7 - minOpacity)
      
      // Crear capa de calor con gradiente más detallado (10 niveles)
      heatLayer = (L as any).heatLayer(data, {
        radius: radius * (intensidad / 50), // Ajustar radio según intensidad
        blur: blur * (intensidad / 50),
        maxZoom,
        max,
        minOpacity: opacity,
        gradient: {
          // Gradiente más detallado con 10 niveles de clasificación
          0.0: 'rgba(0, 100, 0, 0)',           // Verde muy oscuro (muy seguro) - transparente
          0.1: 'rgba(0, 150, 0, 0.2)',         // Verde (seguro)
          0.2: 'rgba(100, 200, 100, 0.3)',     // Verde claro (relativamente seguro)
          0.3: 'rgba(150, 220, 150, 0.4)',     // Verde muy claro (bajo riesgo)
          0.4: 'rgba(173, 216, 230, 0.5)',     // Azul claro (riesgo bajo-medio)
          0.5: 'rgba(255, 255, 0, 0.6)',       // Amarillo (riesgo medio)
          0.6: 'rgba(255, 200, 0, 0.7)',      // Amarillo-naranja (riesgo medio-alto)
          0.7: 'rgba(255, 140, 0, 0.75)',     // Naranja (riesgo alto)
          0.85: 'rgba(255, 69, 0, 0.8)',      // Naranja-rojo (muy alto riesgo)
          0.95: 'rgba(255, 0, 0, 0.85)',      // Rojo (extremadamente peligroso)
          1.0: 'rgba(139, 0, 0, 0.9)',        // Rojo oscuro (zona crítica)
        },
      })

      heatLayer.addTo(map)
      console.log('✅ Mapa de calor agregado al mapa')
    }

    initHeatmap()

    return () => {
      // Cleanup: remover la capa cuando el componente se desmonte o cambien las dependencias
      if (heatLayer) {
        try {
          map.removeLayer(heatLayer)
          console.log('🗑️ Mapa de calor removido')
        } catch (e) {
          // La capa ya fue removida
        }
      }
      // También buscar y remover cualquier otra capa de calor
      map.eachLayer((layer: any) => {
        if (layer._heat && layer._heat._latlngs) {
          try {
            map.removeLayer(layer)
          } catch (e) {
            // Ignorar errores
          }
        }
      })
    }
  }, [map, data, enabled, radius, blur, maxZoom, max, minOpacity, intensidad])

  return null
}

