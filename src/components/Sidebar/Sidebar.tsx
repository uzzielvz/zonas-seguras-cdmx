import { XMarkIcon, FunnelIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { FiltrosMapa, TipoDelito } from '../../types/map'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  filtros: FiltrosMapa
  onFiltrosChange: (filtros: FiltrosMapa) => void
  estadisticas: {
    total: number
    ultimos30Dias: number
  }
}

export default function Sidebar({ isOpen, onClose, filtros, onFiltrosChange, estadisticas }: SidebarProps) {
  
  const handleTipoDelitoChange = (tipo: TipoDelito, checked: boolean) => {
    const nuevosTipos = checked
      ? [...filtros.tiposDelito, tipo]
      : filtros.tiposDelito.filter((t) => t !== tipo)
    onFiltrosChange({ ...filtros, tiposDelito: nuevosTipos })
  }

  const handleCapaChange = (capa: 'mostrarCalor' | 'mostrarBuffers' | 'mostrarReportes', checked: boolean) => {
    onFiltrosChange({ ...filtros, [capa]: checked })
  }

  const handleAlcaldiaChange = (alcaldia: string) => {
    onFiltrosChange({ ...filtros, alcaldia: alcaldia || undefined })
  }
  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 bottom-0 w-80 bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          overflow-y-auto scrollbar-thin
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="p-6">
          {/* Header del sidebar */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5" />
              <span>Filtros y Controles</span>
            </h2>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Sección de Filtros */}
          <div className="space-y-6">
            {/* Tipos de delitos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tipos de Delitos</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                    checked={filtros.tiposDelito.includes('homicidio')}
                    onChange={(e) => handleTipoDelitoChange('homicidio', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Homicidios</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                    checked={filtros.tiposDelito.includes('asalto')}
                    onChange={(e) => handleTipoDelitoChange('asalto', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Asaltos</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={filtros.tiposDelito.includes('robo')}
                    onChange={(e) => handleTipoDelitoChange('robo', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Robos</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    checked={filtros.mostrarAcoso}
                    onChange={(e) => onFiltrosChange({ ...filtros, mostrarAcoso: e.target.checked })}
                  />
                  <span className="text-sm text-gray-700">Acoso</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-gray-600 rounded border-gray-300 focus:ring-gray-500"
                    checked={filtros.mostrarOtro}
                    onChange={(e) => onFiltrosChange({ ...filtros, mostrarOtro: e.target.checked })}
                  />
                  <span className="text-sm text-gray-700">Otro</span>
                </label>
              </div>
            </div>

            {/* Capas */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Capas del Mapa</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                    checked={filtros.mostrarCalor}
                    onChange={(e) => handleCapaChange('mostrarCalor', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Mapa de Calor</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                    checked={filtros.mostrarBuffers}
                    onChange={(e) => handleCapaChange('mostrarBuffers', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Buffers de Riesgo</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={filtros.mostrarReportes}
                    onChange={(e) => handleCapaChange('mostrarReportes', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Reportes Ciudadanos</span>
                </label>
              </div>
            </div>

            {/* Estadísticas */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <ChartBarIcon className="h-4 w-4" />
                <span>Estadísticas</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Reportes visibles</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Últimos 30 días</p>
                  <p className="text-2xl font-bold text-red-600">{estadisticas.ultimos30Dias}</p>
                </div>
              </div>
            </div>

            {/* Alcaldías */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Alcaldía</h3>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filtros.alcaldia || ''}
                onChange={(e) => handleAlcaldiaChange(e.target.value)}
              >
                <option value="">Todas las alcaldías</option>
                <option value="cuauhtemoc">Cuauhtémoc</option>
                <option value="iztapalapa">Iztapalapa</option>
                <option value="gustavo-madero">Gustavo A. Madero</option>
                <option value="benito-juarez">Benito Juárez</option>
                <option value="coyoacan">Coyoacán</option>
              </select>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

