import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import MapView from './components/Map/MapView'
import Sidebar from './components/Sidebar/Sidebar'
import ReportForm from './components/ReportForm/ReportForm'
import { ReporteCiudadano, Coordinates } from './types/map'
import { guardarReporte, obtenerReportes, eliminarReporte } from './utils/reportes'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reportFormOpen, setReportFormOpen] = useState(false)
  const [mapSelectionMode, setMapSelectionMode] = useState(false)
  const [reportes, setReportes] = useState<ReporteCiudadano[]>([])
  const [selectedCoords, setSelectedCoords] = useState<Coordinates | undefined>()

  // Cargar reportes al iniciar
  useEffect(() => {
    setReportes(obtenerReportes())
  }, [])

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
        />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-80' : 'ml-0'}`}>
          <MapView 
            reportes={reportes}
            onMapClick={handleMapClick}
            mapClickEnabled={reportFormOpen || mapSelectionMode}
            onDeleteReport={handleDeleteReport}
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

