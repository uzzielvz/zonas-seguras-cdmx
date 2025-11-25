import { Bars3Icon, MapPinIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
  onMenuClick: () => void
  sidebarOpen: boolean
}

export default function Header({ onMenuClick, sidebarOpen }: HeaderProps) {
  return (
    <header className="bg-white shadow-md z-10 border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-2">
              <MapPinIcon className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">ZonaSegura CDMX</h1>
                <p className="text-xs text-gray-500">Mapa colaborativo de seguridad</p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
              Reportar Incidente
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

