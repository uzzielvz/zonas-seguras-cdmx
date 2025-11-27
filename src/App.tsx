import { useState, useEffect, useMemo } from 'react'
import Header from './components/Header/Header'
import MapView from './components/Map/MapView'
import Sidebar from './components/Sidebar/Sidebar'
import ReportForm from './components/ReportForm/ReportForm'
import { ReporteCiudadano, Coordinates, FiltrosMapa, TipoDelito } from './types/map'
import { guardarReporte, obtenerReportes, eliminarReporte } from './utils/reportes'
import { useDelitosData } from './hooks/useDelitosData'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reportFormOpen, setReportFormOpen] = useState(false)
  const [mapSelectionMode, setMapSelectionMode] = useState(false)
  const [reportes, setReportes] = useState<ReporteCiudadano[]>([])
  const [selectedCoords, setSelectedCoords] = useState<Coordinates | undefined>()
  
  // Estado de filtros
  const [filtros, setFiltros] = useState<FiltrosMapa>({
    tiposDelito: ['homicidio', 'asalto', 'robo'],
    mostrarAcoso: true,
    mostrarOtro: true,
    mostrarCalor: false, // Desactivado por defecto
    mostrarBuffers: false,
    mostrarReportes: true,
    alcaldia: undefined,
    fechaInicio: undefined,
    fechaFin: undefined,
    calorIntensidad: 50, // Intensidad media por defecto
    calorSoloZonasCriticas: false,
    calorMuestreo: true, // Activar muestreo por defecto para mejor rendimiento
    mostrarZonasSeguridad: false, // Desactivado por defecto
  })

  // Cargar reportes al iniciar
  useEffect(() => {
    setReportes(obtenerReportes())
  }, [])

  // Cargar datos de delitos oficiales
  const { delitos, loading: delitosLoading, filtrarDelitos, getHeatmapData } = useDelitosData()

  // Filtrar delitos según los filtros activos
  const delitosFiltrados = useMemo(() => {
    if (!delitos.length) return []
    return filtrarDelitos(filtros)
  }, [delitos, filtros, filtrarDelitos])

  // Obtener datos para el mapa de calor
  const heatmapData = useMemo(() => {
    if (!filtros.mostrarCalor || delitosFiltrados.length === 0) {
      return []
    }
    const data = getHeatmapData(
      delitosFiltrados,
      filtros.calorSoloZonasCriticas || false,
      filtros.calorMuestreo !== false // true por defecto
    )
    return data
  }, [delitosFiltrados, filtros.mostrarCalor, filtros.calorSoloZonasCriticas, filtros.calorMuestreo, getHeatmapData])

  // Filtrar reportes según los filtros activos
  const reportesFiltrados = useMemo(() => {
    return reportes.filter((reporte) => {
      // Filtrar por tipo de delito
      const tipoReporte = reporte.tipo
      
      if (tipoReporte === 'acoso') {
        if (!filtros.mostrarAcoso) return false
      } else if (tipoReporte === 'otro') {
        if (!filtros.mostrarOtro) return false
      } else if (!filtros.tiposDelito.includes(tipoReporte as TipoDelito)) {
        return false
      }

      // Filtrar por mostrar reportes
      if (!filtros.mostrarReportes) {
        return false
      }

      // Filtrar por fecha (últimos 30 días si no hay fecha específica)
      const fechaReporte = new Date(reporte.fecha)
      const ahora = new Date()
      
      // Si hay fecha fin, usar esa; si no, usar ahora (mostrar todos hasta hoy)
      const fechaFin = filtros.fechaFin 
        ? new Date(filtros.fechaFin)
        : ahora
      
      // Si hay fecha inicio, filtrar por ella; si no, mostrar últimos 30 días por defecto
      const fechaInicio = filtros.fechaInicio
        ? new Date(filtros.fechaInicio)
        : new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 días por defecto
      
      // El reporte debe estar entre fechaInicio y fechaFin
      if (fechaReporte < fechaInicio) return false
      if (fechaReporte > fechaFin) return false

      return true
    })
  }, [reportes, filtros])

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    const ahora = new Date()
    const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const reportesUltimos30Dias = reportesFiltrados.filter((r) => {
      const fecha = new Date(r.fecha)
      return fecha >= hace30Dias
    })

    return {
      total: reportesFiltrados.length,
      ultimos30Dias: reportesUltimos30Dias.length,
    }
  }, [reportesFiltrados])

  const handleReportSubmit = (reporte: ReporteCiudadano) => {
    guardarReporte(reporte)
    setReportes(obtenerReportes())
  }

  const handleDeleteReport = (id: string) => {
    eliminarReporte(id)
    setReportes(obtenerReportes())
  }

  const handleMapClick = (coords: Coordinates) => {
    if (reportFormOpen) {
      // Si el formulario está abierto, actualizar coordenadas
      setSelectedCoords(coords)
    } else if (mapSelectionMode) {
      // Si está en modo de selección, cerrar el modo y abrir el formulario con las coordenadas
      setSelectedCoords(coords)
      setMapSelectionMode(false)
      setReportFormOpen(true)
    }
  }

  const handleReportClick = () => {
    setReportFormOpen(true)
    setSelectedCoords(undefined)
    setMapSelectionMode(false)
  }

  const handleSelectOnMap = () => {
    // Cerrar formulario y activar modo de selección
    setReportFormOpen(false)
    setMapSelectionMode(true)
  }

  const handleGetLocation = () => {
    // El formulario maneja la geolocalización internamente
    // Esta función puede usarse para centrar el mapa en la ubicación del usuario
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen}
        onReportClick={handleReportClick}
      />
      
      <div className="flex-1 flex relative overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          filtros={filtros}
          onFiltrosChange={setFiltros}
          estadisticas={estadisticas}
        />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-80' : 'ml-0'}`}>
          <MapView 
            reportes={filtros.mostrarReportes ? reportesFiltrados : []}
            onMapClick={handleMapClick}
            mapClickEnabled={reportFormOpen || mapSelectionMode}
            mapSelectionMode={mapSelectionMode}
            onDeleteReport={handleDeleteReport}
            filtros={filtros}
            heatmapData={heatmapData}
            calorIntensidad={filtros.calorIntensidad || 50}
            delitos={filtros.mostrarZonasSeguridad ? delitosFiltrados : []}
          />
          
          {/* Indicador de modo de selección */}
          {mapSelectionMode && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1000] bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="font-medium">Haz clic en el mapa para seleccionar la ubicación</span>
              <button
                onClick={() => setMapSelectionMode(false)}
                className="ml-2 text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      <ReportForm
        isOpen={reportFormOpen}
        onClose={() => {
          setReportFormOpen(false)
          setSelectedCoords(undefined)
          setMapSelectionMode(false)
        }}
        onReportSubmit={handleReportSubmit}
        initialCoordinates={selectedCoords}
        onGetLocation={handleGetLocation}
        onSelectOnMap={handleSelectOnMap}
      />
    </div>
  )
}

export default App

