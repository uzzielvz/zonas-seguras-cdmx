import { XMarkIcon, FunnelIcon, ChartBarIcon } from '@heroicons/react/24/outline'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700">Homicidios</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700">Asaltos</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700">Robos</span>
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
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700">Mapa de Calor</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Buffers de Riesgo</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    defaultChecked
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
                  <p className="text-xs text-gray-500">Delitos visibles</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Últimos 30 días</p>
                  <p className="text-2xl font-bold text-red-600">0</p>
                </div>
              </div>
            </div>

            {/* Alcaldías */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Alcaldía</h3>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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

