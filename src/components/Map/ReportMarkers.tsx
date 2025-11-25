import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { ReporteCiudadano } from '../../types/map'

interface ReportMarkersProps {
  reportes: ReporteCiudadano[]
  onDeleteReport?: (id: string) => void
}

// SVG paths para cada tipo de delito
const iconSVGs = {
  robo: `<path d="M12 2L2 7V10C2 15.55 5.5 20.74 12 22C18.5 20.74 22 15.55 22 10V7L12 2Z" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="white"/><path d="M9 12L11 14L15 10" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8H16M8 8V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V8M8 8H16" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>`,
  asalto: `<path d="M12 2L2 7V10C2 15.55 5.5 20.74 12 22C18.5 20.74 22 15.55 22 10V7L12 2Z" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="white"/><path d="M9 9L15 15M15 9L9 15" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="1" fill="#f97316"/>`,
  homicidio: `<path d="M12 2L2 7V10C2 15.55 5.5 20.74 12 22C18.5 20.74 22 15.55 22 10V7L12 2Z" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="white"/><path d="M8 12H16M12 8V16" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="#dc2626"/>`,
  acoso: `<path d="M12 2L2 7V10C2 15.55 5.5 20.74 12 22C18.5 20.74 22 15.55 22 10V7L12 2Z" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="white"/><path d="M8 10C8 8.89543 8.89543 8 10 8H14C15.1046 8 16 8.89543 16 10V14C16 15.1046 15.1046 16 14 16H10C8.89543 16 8 15.1046 8 14V10Z" stroke="#a855f7" stroke-width="2" stroke-linecap="round"/><path d="M12 10V14" stroke="#a855f7" stroke-width="2" stroke-linecap="round"/>`,
  otro: `<path d="M12 2L2 7V10C2 15.55 5.5 20.74 12 22C18.5 20.74 22 15.55 22 10V7L12 2Z" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="white"/><path d="M12 8V12M12 16H12.01" stroke="#6b7280" stroke-width="2" stroke-linecap="round"/>`,
}

// Crear icono personalizado según el tipo de delito
function createReportIcon(tipo: string) {
  const svgPath = iconSVGs[tipo as keyof typeof iconSVGs] || iconSVGs.otro
  const color = tipo === 'robo' ? '#ef4444' : 
                tipo === 'asalto' ? '#f97316' : 
                tipo === 'homicidio' ? '#dc2626' : 
                tipo === 'acoso' ? '#a855f7' : '#6b7280'
  
  return L.divIcon({
    className: 'report-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: white;
        border: 3px solid ${color};
        border-radius: 50%;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2), 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s infinite;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          ${svgPath}
        </svg>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2), 0 2px 8px rgba(0,0,0,0.3);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(239, 68, 68, 0), 0 2px 12px rgba(0,0,0,0.4);
          }
        }
      </style>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

export default function ReportMarkers({ reportes, onDeleteReport }: ReportMarkersProps) {
  const map = useMap()

  useEffect(() => {
    const markers: L.Marker[] = []

    reportes.forEach((reporte) => {
      const marker = L.marker(
        [reporte.coordenadas[0], reporte.coordenadas[1]],
        { icon: createReportIcon(reporte.tipo) }
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

