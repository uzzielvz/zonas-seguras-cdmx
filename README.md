# ZonaSegura CDMX - Mapa Colaborativo de Seguridad

Aplicación web interactiva que combina datos oficiales de delitos de la Ciudad de México con reportes en tiempo real hechos por ciudadanos.

## 🚀 Características

- 📍 **Mapa interactivo** con datos oficiales de la Fiscalía General de Justicia CDMX
- 🔥 **Mapa de calor** de delitos desde 2019
- ⚠️ **Buffers de riesgo** (150m) alrededor de delitos graves
- 👥 **Reportes ciudadanos** colaborativos
- 🔍 **Filtros avanzados** por tipo, alcaldía y fecha
- 📊 **Estadísticas en tiempo real**

## 🛠️ Stack Tecnológico

- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (UI moderna)
- **React-Leaflet** (Mapas)
- **Turf.js** (Análisis geográfico)
- **Heroicons** (Iconos)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Map/
│   │   └── MapView.tsx       # Componente principal del mapa
│   ├── Header/
│   │   └── Header.tsx        # Header de la aplicación
│   └── Sidebar/
│       └── Sidebar.tsx       # Panel lateral de filtros
├── types/
│   └── map.ts                # Tipos TypeScript
├── App.tsx                   # Componente principal
├── main.tsx                  # Punto de entrada
└── index.css                 # Estilos globales
```

## 🗺️ Funcionalidades Principales

### Capas del Mapa

1. **Mapa de Calor**: Visualización de densidad de delitos
2. **Buffers de Riesgo**: Zonas de alto riesgo (150m alrededor de delitos graves)
3. **Marcadores**: Reportes ciudadanos individuales

### Filtros

- Por tipo de delito (Homicidios, Asaltos, Robos)
- Por alcaldía
- Por rango de fechas
- Activar/desactivar capas

## 📝 Próximos Pasos

- [ ] Cargar datos GeoJSON de delitos oficiales
- [ ] Implementar mapa de calor con Leaflet.heat
- [ ] Crear buffers de riesgo con Turf.js
- [ ] Sistema de reportes ciudadanos con LocalStorage
- [ ] Estadísticas en tiempo real
- [ ] Búsqueda por dirección/colonia
- [ ] Modo oscuro

## 📄 Licencia

Proyecto académico - Sistemas de Información Geográfica

