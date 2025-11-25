import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { Coordinates } from '../../types/map'

interface MapClickHandlerProps {
  onMapClick: (coords: Coordinates) => void
  enabled: boolean
}

export default function MapClickHandler({ onMapClick, enabled }: MapClickHandlerProps) {
  const map = useMap()

  useEffect(() => {
    if (!enabled) {
      // Restaurar cursor normal
      const container = map.getContainer()
      container.style.cursor = ''
      return
    }

    // Cambiar cursor para indicar que se puede hacer clic
    const container = map.getContainer()
    container.style.cursor = 'crosshair'

    const handleClick = (e: L.LeafletMouseEvent) => {
      const coords: Coordinates = [e.latlng.lat, e.latlng.lng]
      onMapClick(coords)
    }

    map.on('click', handleClick)

    return () => {
      map.off('click', handleClick)
      container.style.cursor = ''
    }
  }, [map, onMapClick, enabled])

  return null
}

