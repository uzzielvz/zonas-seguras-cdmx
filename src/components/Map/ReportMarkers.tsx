import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { ReporteCiudadano } from '../../types/map'

interface ReportMarkersProps {
  reportes: ReporteCiudadano[]
  onDeleteReport?: (id: string) => void
}

// Crear icono personalizado rojo pulsante para reportes ciudadanos
function createReportIcon() {
  return L.divIcon({
    className: 'report-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #ef4444;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

export default function ReportMarkers({ reportes, onDeleteReport }: ReportMarkersProps) {
  const map = useMap()

  useEffect(() => {
    const markers: L.Marker[] = []

    reportes.forEach((reporte) => {
      const marker = L.marker(
        [reporte.coordenadas[0], reporte.coordenadas[1]],
        { icon: createReportIcon() }
      )

      // Popup con información del reporte y botón de eliminar
      const deleteButton = onDeleteReport
        ? `<button 
            id="delete-${reporte.id}" 
            style="
              margin-top: 8px;
              padding: 6px 12px;
              background-color: #ef4444;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 0.85em;
              width: 100%;
            "
            onmouseover="this.style.backgroundColor='#dc2626'"
            onmouseout="this.style.backgroundColor='#ef4444'"
          >
            Eliminar Reporte
          </button>`
        : ''

      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; color: #ef4444;">
            ${reporte.tipo.charAt(0).toUpperCase() + reporte.tipo.slice(1)}
          </h3>
          ${reporte.descripcion ? `<p style="margin-bottom: 8px;">${reporte.descripcion}</p>` : ''}
          <p style="font-size: 0.85em; color: #666; margin-bottom: 8px;">
            ${new Date(reporte.fecha).toLocaleString('es-MX')}
          </p>
          ${reporte.foto ? `<img src="${reporte.foto}" style="width: 100%; margin-top: 8px; margin-bottom: 8px; border-radius: 4px;" />` : ''}
          ${deleteButton}
        </div>
      `
      
      marker.bindPopup(popupContent)
      
      // Manejar clic en el botón de eliminar
      marker.on('popupopen', () => {
        const deleteBtn = document.getElementById(`delete-${reporte.id}`)
        if (deleteBtn && onDeleteReport) {
          deleteBtn.onclick = () => {
            if (confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
              onDeleteReport(reporte.id)
              marker.closePopup()
            }
          }
        }
      })

      marker.addTo(map)
      markers.push(marker)
    })

    return () => {
      markers.forEach((marker) => {
        map.removeLayer(marker)
      })
    }
  }, [map, reportes, onDeleteReport])

  return null
}

