import { useState } from 'react'
import Header from './components/Header/Header'
import MapView from './components/Map/MapView'
import Sidebar from './components/Sidebar/Sidebar'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex-1 flex relative overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-80' : 'ml-0'}`}>
          <MapView />
        </div>
      </div>
    </div>
  )
}

export default App

