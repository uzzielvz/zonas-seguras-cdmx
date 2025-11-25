# Stack Tecnológico - ZonaSegura CDMX

## 🎯 Recomendación Principal: Stack Moderno y Profesional

Para este proyecto, se recomienda un stack **moderno, profesional y escalable** que permita crear una aplicación web robusta y mantenible.

---

## 📋 Stack Recomendado ⭐

### **Frontend (Aplicación Web)**

#### **Framework Principal** (RECOMENDADO)
- **React 18** ⭐ (Recomendado)
  - ✅ Estándar de la industria
  - ✅ Componentes reutilizables
  - ✅ Gran ecosistema de librerías
  - ✅ Mejor organización del código
  - ✅ Más mantenible y escalable
  - ✅ Perfecto para dashboards y mapas interactivos

- **TypeScript** ⭐ (Recomendado)
  - ✅ Type safety - Evita errores comunes
  - ✅ Mejor autocompletado en IDE
  - ✅ Refactoring más seguro
  - ✅ Documentación implícita
  - ✅ Estándar profesional moderno

- **Vite** ⭐ (Build Tool Recomendado)
  - ✅ Desarrollo ultra-rápido (HMR instantáneo)
  - ✅ Zero config - Setup en segundos
  - ✅ Build optimizado automáticamente
  - ✅ Mejor que Create React App

**Alternativa Simple**:
- **Vanilla JavaScript** - Solo si prefieres simplicidad extrema

#### **Librería de Mapas** ⭐
- **Leaflet.js** + **react-leaflet** (Recomendado)
  - ✅ **react-leaflet** - Componentes React para Leaflet
  - ✅ Más simple y ligero que OpenLayers
  - ✅ Excelente documentación
  - ✅ Gran comunidad
  - ✅ Plugins abundantes
  - ✅ Ideal para proyectos con React
  - 📦 npm: `npm install leaflet react-leaflet`

**Alternativas**:
- **OpenLayers** + **react-openlayers** - Más potente pero más complejo
- **Mapbox GL JS** + **react-map-gl** - Requiere API key (gratis pero con límites)

#### **Librerías de Soporte para Leaflet**

1. **react-leaflet-heat** - Mapas de calor para React
   ```bash
   npm install react-leaflet-heat
   ```

2. **react-leaflet-cluster** - Agrupación de marcadores para React
   ```bash
   npm install react-leaflet-cluster
   ```

3. **@turf/turf** - Análisis geográfico (buffers, cálculos)
   ```bash
   npm install @turf/turf
   ```

4. **leaflet.heat** - Plugin original (si necesitas más control)
   ```bash
   npm install leaflet.heat
   npm install @types/leaflet.heat --save-dev
   ```

#### **UI/UX Framework** ⭐ (RECOMENDADO - UI Moderna y Profesional)
- **Tailwind CSS** ⭐ (Recomendado para UI moderna)
  - ✅ Diseño moderno y profesional
  - ✅ Utility-first (muy flexible)
  - ✅ Perfecta integración con React
  - ✅ Excelente para dashboards y mapas
  - ✅ Muy popular y estandarizado
  - 📦 npm: `npm install -D tailwindcss postcss autoprefixer`

- **Bootstrap 5** (Alternativa sólida)
  - ✅ Componentes listos para usar
  - ✅ react-bootstrap disponible
  - ✅ Más tradicional pero confiable

- **Componentes UI (Opcional)**:
  - **Headless UI** - Componentes accesibles (sin estilos)
  - **Radix UI** - Componentes primitivos
  - **shadcn/ui** - Componentes con Tailwind (muy recomendado)

- **Iconos**:
  - **@heroicons/react** ⭐ - Iconos SVG para React
  - **lucide-react** - Iconos minimalistas modernos
  - **react-icons** - Biblioteca completa de iconos

---

### **Procesamiento de Datos**

#### **Conversión CSV → GeoJSON**
- **Python 3** con librerías:
  - `pandas` - Manejo de CSV
  - `geojson` - Creación de GeoJSON
  - Script simple para convertir una vez

#### **Alternativa (si prefieres JavaScript)**
- **PapaParse** - Parser CSV en el navegador
- Procesar en el cliente (solo para datasets pequeños)

---

### **Almacenamiento de Datos**

#### **Para Demo/Proyecto Académico**
- **LocalStorage** - Reportes ciudadanos
- **Archivos GeoJSON estáticos** - Datos oficiales
  - `delitos_oficiales.geojson` (55k puntos)
  - `delitos_graves.geojson` (20k puntos para buffers)

#### **Para Producción (Opcional)**
- **Backend simple**: Node.js + Express
- **Base de datos**: 
  - PostgreSQL + PostGIS (mejor para datos geoespaciales)
  - O MongoDB (más simple)
- **API REST** para reportes ciudadanos

---

### **Servidor de Desarrollo**

#### **Opciones Simples**
1. **Python HTTP Server** (más simple)
   ```bash
   python -m http.server 8000
   ```

2. **Node.js http-server**
   ```bash
   npx http-server -p 8000
   ```

3. **Live Server** (extensión VS Code) - Auto-refresh

#### **Para Producción**
- **GitHub Pages** (gratis, estático)
- **Netlify** (gratis, fácil deploy)
- **Vercel** (gratis, fácil deploy)

---

## 🏗️ Arquitectura Propuesta (React + TypeScript)

### **Estructura de Archivos**

```
proyecto/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapView.tsx           # Componente principal del mapa
│   │   │   ├── HeatMapLayer.tsx      # Capa de mapa de calor
│   │   │   ├── BufferLayer.tsx       # Capa de buffers de riesgo
│   │   │   ├── MarkersLayer.tsx      # Capa de marcadores
│   │   │   └── ReportMarker.tsx      # Marcador de reporte ciudadano
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx           # Panel lateral
│   │   │   ├── Filters.tsx           # Componente de filtros
│   │   │   └── Statistics.tsx        # Estadísticas
│   │   ├── Header/
│   │   │   └── Header.tsx            # Header de la aplicación
│   │   ├── Modal/
│   │   │   └── ReportModal.tsx       # Modal para reportar incidente
│   │   └── UI/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Badge.tsx
│   ├── hooks/
│   │   ├── useMap.ts                 # Hook para lógica del mapa
│   │   ├── useDelitos.ts             # Hook para datos de delitos
│   │   └── useReports.ts             # Hook para reportes ciudadanos
│   ├── types/
│   │   ├── delito.ts                 # Tipos TypeScript para delitos
│   │   ├── reporte.ts                # Tipos para reportes
│   │   └── map.ts                    # Tipos para mapas
│   ├── utils/
│   │   ├── geojson.ts                # Utilidades para GeoJSON
│   │   ├── filters.ts                # Funciones de filtrado
│   │   └── statistics.ts             # Cálculos estadísticos
│   ├── services/
│   │   ├── localStorage.ts           # Servicio LocalStorage
│   │   └── geojsonLoader.ts          # Carga de GeoJSON
│   ├── App.tsx                       # Componente principal
│   ├── main.tsx                      # Punto de entrada
│   └── index.css                     # Estilos globales (Tailwind)
├── data/
│   ├── delitos_oficiales.geojson     # Datos oficiales (55k puntos)
│   └── delitos_graves.geojson        # Delitos graves para buffers (20k)
├── scripts/
│   └── csv_to_geojson.py             # Script de conversión
├── package.json
├── tsconfig.json                     # Configuración TypeScript
├── tailwind.config.js                # Configuración Tailwind
├── vite.config.ts                    # Configuración Vite
└── README.md
```

---

## 📦 Dependencias Completas

### **package.json (React + TypeScript + Vite)** ⭐

```json
{
  "name": "zonasegura-cdmx",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "convert": "python scripts/csv_to_geojson.py"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-leaflet": "^4.2.1",
    "leaflet": "^1.9.4",
    "leaflet.heat": "^0.2.0",
    "@turf/turf": "^6.5.0",
    "@heroicons/react": "^2.0.18",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/leaflet": "^1.9.8",
    "@types/leaflet.heat": "^0.2.8",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

### **Instalación Rápida** 🚀

```bash
# Crear proyecto con Vite + React + TypeScript
npm create vite@latest zonasegura-cdmx -- --template react-ts

# Navegar al proyecto
cd zonasegura-cdmx

# Instalar dependencias base
npm install

# Instalar librerías de mapas
npm install react-leaflet leaflet leaflet.heat @turf/turf

# Instalar iconos
npm install @heroicons/react lucide-react

# Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Instalar tipos TypeScript
npm install -D @types/leaflet @types/leaflet.heat

# Iniciar servidor de desarrollo
npm run dev
```

### **Alternativa: Vanilla JS (más simple)**

Si prefieres Vanilla JS sin React, puedes usar las dependencias vía CDN (ver sección de Stack Alternativo más abajo).

---

## 🛠️ Herramientas de Desarrollo

### **Recomendadas**
- **Editor**: VS Code
- **Control de versiones**: Git + GitHub
- **Navegador**: Chrome/Firefox (DevTools para debugging)

### **Extensiones VS Code Útiles**
- Live Server
- Prettier (formateo de código)
- ESLint (linting de JavaScript)

---

## 🚀 Stack Alternativo (Más Simple)

Si prefieres algo más simple sin React:

### **Vanilla JavaScript + TypeScript**
- **HTML5 + CSS3 + JavaScript**
- **TypeScript** (opcional, pero recomendado)
- **Vite** para desarrollo rápido
- **Tailwind CSS** para UI

### **Stack Minimalista**
- **Vanilla JS** (sin frameworks)
- **Tailwind CSS** vía CDN
- **Leaflet.js** vía CDN
- **Python HTTP Server** para desarrollo

### **Backend (Opcional - Solo si necesitas persistencia real)**
- **Node.js + Express** (TypeScript)
- **SQLite** - Más simple que PostgreSQL
- **JSON Server** - Mock API rápido para desarrollo
- **PostgreSQL + PostGIS** - Para producción con datos geoespaciales

---

## 📊 Comparación de Librerías de Mapas

| Característica | Leaflet | OpenLayers | Mapbox GL JS |
|----------------|---------|------------|--------------|
| **Facilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Tamaño** | ~40 KB | ~200 KB | ~200 KB |
| **Documentación** | Excelente | Buena | Excelente |
| **Plugins** | Muchos | Moderados | Integrados |
| **API Key** | No | No | Sí (gratis) |
| **Rendimiento** | Bueno | Excelente | Excelente |
| **Curva aprendizaje** | Baja | Media | Media |
| **Recomendado para** | Proyectos académicos | Aplicaciones complejas | Aplicaciones profesionales |

**Veredicto**: **Leaflet** es la mejor opción para este proyecto.

---

## 🎨 Stack de Diseño (RECOMENDADO - UI Moderna)

### **Opción 1: Tailwind CSS** ⭐ (RECOMENDADO)
- ✅ **Diseño moderno y profesional**
- ✅ **Utility-first** - Construye cualquier diseño rápidamente
- ✅ **Componentes modernos** - Cards, modals, sidebars elegantes
- ✅ **Responsive por defecto** - Mobile-first approach
- ✅ **Dark mode** - Fácil de implementar
- ✅ **Muy popular** - Estándar de la industria
- ✅ **CDN disponible** - No requiere build process
- ✅ **Perfecto para dashboards** - Ideal para mapas interactivos

**Ejemplo de uso**:
```html
<div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
  <h2 class="text-2xl font-bold text-gray-800 mb-4">Panel de Control</h2>
  <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
    Filtrar
  </button>
</div>
```

### **Opción 2: Bootstrap 5**
- ✅ Componentes listos para usar
- ✅ Más tradicional pero confiable
- ✅ Buena documentación
- ⚠️ Menos flexible que Tailwind

### **Componentes UI Modernos Adicionales**

#### **Para Sidebar/Panel de Control**
- **Sidebar moderno** con Tailwind
- **Glassmorphism** (efecto de vidrio) para paneles flotantes
- **Gradientes modernos** para headers

#### **Para Mapas**
- **Panel lateral deslizable** para filtros
- **Cards flotantes** para información
- **Badges y chips** para etiquetas
- **Tooltips modernos** para información adicional

#### **Paleta de Colores Sugerida (Moderno)**
```css
Primarios:
- Azul: #3B82F6 (blue-500)
- Rojo (riesgo): #EF4444 (red-500)
- Verde (seguro): #10B981 (green-500)
- Naranja (alerta): #F59E0B (amber-500)

Neutros:
- Fondo: #F9FAFB (gray-50)
- Texto: #111827 (gray-900)
- Bordes: #E5E7EB (gray-200)
```

#### **Tipografía Moderna**
- **Google Fonts**: Inter, Poppins, o Roboto
- **Tamaños**: Sistema de escala moderna (text-sm, text-base, text-lg, etc.)

---

## 📝 Resumen del Stack Recomendado

### **Stack Recomendado (React + TypeScript + Vite)** ⭐⭐⭐

```
Frontend Framework:
- React 18 + TypeScript
- Vite (build tool)

UI/UX:
- Tailwind CSS (UI moderna)
- Heroicons / Lucide React (iconos)
- Google Fonts (tipografía)

Mapas:
- react-leaflet (Leaflet para React)
- leaflet.heat (mapas de calor)
- @turf/turf (análisis geográfico)

Datos:
- GeoJSON estático (optimizado)
- LocalStorage (reportes ciudadanos)

Herramientas:
- Python (conversión CSV→GeoJSON)
- Git + GitHub
- VS Code

Deploy:
- Vercel / Netlify (gratis, fácil)
- GitHub Pages (gratis)
```

### **Stack Alternativo Simple (Vanilla JS)** 

```
Frontend:
- HTML5 + CSS3 + JavaScript (Vanilla)
- Tailwind CSS vía CDN
- Leaflet.js vía CDN
- Turf.js vía CDN

Datos:
- GeoJSON estático
- LocalStorage (reportes)

Herramientas:
- Python HTTP Server (desarrollo)
- GitHub Pages (producción)
```

### **Características de UI/UX Incluidas**
- ✅ **Diseño moderno** con Tailwind CSS
- ✅ **Responsive** - Mobile-first
- ✅ **Dark mode** (opcional)
- ✅ **Animaciones suaves** - Transiciones
- ✅ **Componentes reutilizables** - Cards, modals, sidebars
- ✅ **Iconografía moderna** - Heroicons
- ✅ **Tipografía profesional** - Google Fonts
- ✅ **Paleta de colores consistente**
- ✅ **Accesibilidad** - ARIA labels, contraste adecuado

---

## 🔧 Configuraciones Necesarias

### **1. tsconfig.json (TypeScript)**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### **2. vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
```

### **3. tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### **4. Conversión CSV → GeoJSON (Python)**

```python
# scripts/csv_to_geojson.py
import pandas as pd
import json

# Leer CSV
df = pd.read_csv('data/da_carpetas-de-investigacion-pgj-cdmx (1).csv')

# Filtrar y convertir a GeoJSON
# ... (lógica de conversión)
```

---

## ✅ Checklist de Implementación

- [ ] Configurar estructura de carpetas
- [ ] Instalar/setup Leaflet
- [ ] Convertir CSV a GeoJSON
- [ ] Crear mapa base
- [ ] Implementar mapa de calor
- [ ] Implementar buffers de riesgo
- [ ] Sistema de reportes ciudadanos
- [ ] Filtros y controles
- [ ] Diseño responsive
- [ ] Testing en diferentes navegadores
- [ ] Optimización de rendimiento
- [ ] Documentación

---

## 🎯 Conclusión

**Stack Final Recomendado (React + TypeScript + Vite)** ⭐⭐⭐:

1. **Frontend Framework**: **React 18** + **TypeScript**
2. **Build Tool**: **Vite** (desarrollo ultra-rápido)
3. **UI Framework**: **Tailwind CSS** (diseño moderno y estandarizado)
4. **Mapas**: **react-leaflet** (Leaflet para React)
5. **Análisis**: **Turf.js**
6. **Iconos**: **@heroicons/react** o **lucide-react**
7. **Tipografía**: Google Fonts (Inter o Poppins)
8. **Datos**: GeoJSON estático
9. **Almacenamiento**: LocalStorage
10. **Deploy**: Vercel, Netlify o GitHub Pages

### **Ventajas de React + TypeScript + Vite**:

- ✅ **Profesional y moderno** - Estándar de la industria actual
- ✅ **Type safety** - TypeScript previene errores comunes
- ✅ **Componentes reutilizables** - Código más organizado y mantenible
- ✅ **Desarrollo rápido** - Vite con HMR instantáneo
- ✅ **Mejor autocompletado** - IDE con TypeScript es más potente
- ✅ **Refactoring seguro** - TypeScript facilita cambios grandes
- ✅ **Escalable** - Fácil agregar nuevas funcionalidades
- ✅ **Ecosistema rico** - Muchas librerías compatibles con React
- ✅ **UI moderna** - Tailwind CSS + React = diseño profesional
- ✅ **Perfecto para proyecto académico** - Se ve muy profesional

### **Ventajas específicas para este proyecto**:

- 🗺️ **react-leaflet** - Integración perfecta de mapas con React
- 📊 **Componentes reutilizables** - Sidebar, Cards, Modals fáciles de crear
- 🔄 **Estado manejable** - React hooks para filtros y capas del mapa
- ⚡ **Performance** - React optimiza renderizado, Vite optimiza build
- 🎨 **Tailwind CSS** - Diseño moderno sin escribir CSS manual
- 📱 **Responsive fácil** - Clases Tailwind hacen responsive simple

### **Comparación React vs Vanilla JS**:

| Aspecto | React + TypeScript | Vanilla JS |
|---------|-------------------|------------|
| **Organización** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Mantenibilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Escalabilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Type Safety** | ⭐⭐⭐⭐⭐ | ⭐ |
| **Velocidad desarrollo** | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Curva aprendizaje** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Profesional** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Complejidad setup** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Veredicto**: **React + TypeScript + Vite** es la mejor opción para un proyecto moderno, profesional y escalable.

---

## 🎨 Ejemplos de Componentes UI Modernos

### **Panel Lateral (Sidebar) con Tailwind**

```html
<!-- Sidebar moderno para filtros -->
<aside class="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300">
  <div class="p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Filtros</h2>
    
    <!-- Checkboxes modernos -->
    <div class="space-y-4">
      <label class="flex items-center space-x-3 cursor-pointer">
        <input type="checkbox" class="w-5 h-5 text-blue-600 rounded">
        <span class="text-gray-700">Mapa de calor</span>
      </label>
    </div>
  </div>
</aside>
```

### **Card Moderna para Estadísticas**

```html
<div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-gray-800">Delitos en el área</h3>
    <span class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">Alto</span>
  </div>
  <p class="text-3xl font-bold text-gray-900">1,234</p>
  <p class="text-sm text-gray-500 mt-2">Últimos 30 días</p>
</div>
```

### **Botón Moderno con Icono**

```html
<button class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
  </svg>
  <span>Reportar Incidente</span>
</button>
```

### **Modal Moderno (Glassmorphism)**

```html
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Reportar Incidente</h2>
    <!-- Formulario aquí -->
  </div>
</div>
```

---

## 📐 Mejores Prácticas de UI/UX

### **1. Layout Principal**
- **Header fijo** en la parte superior con logo y navegación
- **Sidebar deslizable** para filtros y controles
- **Mapa a pantalla completa** como elemento principal
- **Panel flotante** para información contextual

### **2. Colores y Jerarquía Visual**
- **Rojo**: Zonas de alto riesgo, alertas
- **Naranja/Amarillo**: Zonas de riesgo medio
- **Verde**: Zonas seguras
- **Azul**: Información, acciones principales
- **Gris**: Elementos neutros, texto secundario

### **3. Componentes Clave**
- **Cards informativas** con estadísticas
- **Badges** para etiquetas (Alto riesgo, Seguro, etc.)
- **Tooltips** en marcadores del mapa
- **Modals** para reportes y detalles
- **Loading states** mientras carga el mapa
- **Empty states** cuando no hay datos

### **4. Responsive Design**
- **Mobile**: Sidebar como drawer, mapa a pantalla completa
- **Tablet**: Sidebar colapsable, mapa principal
- **Desktop**: Sidebar fijo, mapa + panel lateral

### **5. Interacciones**
- **Hover effects** en botones y cards
- **Transiciones suaves** al cambiar capas
- **Animaciones sutiles** al cargar datos
- **Feedback visual** en todas las acciones

---

## 🚀 Recursos Adicionales

### **Templates y Componentes**
- **Tailwind UI** - Componentes premium (pago, pero hay ejemplos gratis)
- **Headless UI** - Componentes accesibles para Tailwind
- **Flowbite** - Componentes Tailwind gratuitos

### **Inspiración de Diseño**
- **Dribbble** - Búsqueda: "dashboard map", "crime map"
- **Behance** - Proyectos de mapas interactivos
- **Awwwards** - Sitios web premiados con mapas

### **Iconos**
- **Heroicons** - Iconos SVG modernos (recomendado)
- **Lucide Icons** - Iconos minimalistas
- **Font Awesome** - Biblioteca completa

---

**¿Listo para empezar?** 🚀

