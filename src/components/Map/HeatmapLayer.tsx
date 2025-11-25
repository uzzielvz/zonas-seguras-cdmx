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
    if (!enabled || data.length === 0) {
      return
    }

    let heatLayer: any = null

    const initHeatmap = async () => {
      await loadHeatPlugin()
      
      // Verificar que leaflet.heat esté disponible
      if (!(L as any).heatLayer) {
        console.error('❌ leaflet.heat no está disponible después de cargar')
        return
      }

      console.log('🔥 Creando mapa de calor con', data.length, 'puntos')

      // Ajustar opacidad según intensidad (0-100 -> 0.1-0.8)
      const opacity = minOpacity + (intensidad / 100) * (0.7 - minOpacity)
      
      // Crear capa de calor con parámetros ajustados
      heatLayer = (L as any).heatLayer(data, {
        radius: radius * (intensidad / 50), // Ajustar radio según intensidad
        blur: blur * (intensidad / 50),
        maxZoom,
        max,
        minOpacity: opacity,
        gradient: {
          0.0: 'rgba(0, 0, 255, 0)',      // Azul transparente
          0.3: 'rgba(0, 255, 255, 0.3)',  // Cyan
          0.5: 'rgba(255, 255, 0, 0.5)',  // Amarillo
          0.7: 'rgba(255, 165, 0, 0.7)',  // Naranja
          1.0: 'rgba(255, 0, 0, 0.9)',   // Rojo intenso
        },
      })

      heatLayer.addTo(map)
      console.log('✅ Mapa de calor agregado al mapa')
    }

    initHeatmap()

    return () => {
      if (heatLayer) {
        map.removeLayer(heatLayer)
        console.log('🗑️ Mapa de calor removido')
      }
    }
  }, [map, data, enabled, radius, blur, maxZoom, max, minOpacity])

  return null
}

