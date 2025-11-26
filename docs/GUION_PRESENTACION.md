# Guion de Presentación - ZonaSegura CDMX
## Mapa Colaborativo de Seguridad Ciudadana

---

## 1. INTRODUCCIÓN (2-3 minutos)

### Saludo y Contexto
- "Buenos días/tardes profesor, compañeros"
- "El día de hoy presentaré el proyecto: **ZonaSegura CDMX - Mapa Colaborativo de Seguridad Ciudadana**"

### Problema Identificado
- "La seguridad ciudadana es una preocupación constante en la Ciudad de México"
- "Existen datos oficiales de delitos, pero no están fácilmente accesibles para el ciudadano común"
- "Necesidad de combinar datos oficiales con reportes en tiempo real de ciudadanos"

### Objetivo del Proyecto
- "Crear una aplicación web interactiva que visualice datos de delitos de manera clara y accesible"
- "Permitir que ciudadanos reporten incidentes y contribuyan con información en tiempo real"
- "Ayudar a visitantes y residentes a tomar decisiones informadas sobre seguridad"

---

## 2. REQUERIMIENTOS DEL CURSO (1 minuto)

### Cumplimiento de Requisitos
- ✅ **Solución Web**: Aplicación React + TypeScript
- ✅ **Mapa**: Implementado con Leaflet.js
- ✅ **Formato GeoJSON**: Datos procesados y almacenados en GeoJSON
- ✅ **3 Capacidades GIS**:
  1. **Captura**: Sistema de reportes ciudadanos con coordenadas
  2. **Consulta**: Visualización interactiva en mapa
  3. **Análisis Geográfico**: Mapas de calor y clasificación de zonas de seguridad

---

## 3. STACK TECNOLÓGICO (2 minutos)

### Frontend
- **React 18.2**: Framework para construir la interfaz
- **TypeScript 5.2**: Tipado estático para mayor robustez
- **Vite 5.0**: Herramienta de build rápida y moderna
- **Tailwind CSS 3.3**: Framework de estilos para diseño moderno

### Librerías Geoespaciales
- **Leaflet.js 1.9**: Biblioteca principal para mapas (open-source, ligera)
- **react-leaflet 4.2**: Integración de Leaflet con React
- **leaflet.heat 0.2**: Plugin para mapas de calor
- **Turf.js 6.5**: Análisis geoespacial (buffers, unions, cálculos de densidad)

### Procesamiento de Datos
- **Python**: Script para convertir CSV (808k registros) a GeoJSON
- **pandas, geojson**: Librerías de procesamiento

### Almacenamiento
- **LocalStorage**: Para reportes ciudadanos (demo)
- **GeoJSON estático**: Datos oficiales pre-procesados

---

## 4. FUENTE DE DATOS (2 minutos)

### Datos Oficiales - Fiscalía General de Justicia CDMX
- **Archivo original**: CSV con 808,871 registros (~200MB)
- **Período**: 2019 en adelante
- **Procesamiento realizado**:
  - Validación de coordenadas (solo dentro de CDMX)
  - Filtrado por tipo: robos, asaltos, homicidios
  - Conversión a formato GeoJSON
- **Resultado**: 55,561 delitos válidos procesados
  - 15,761 robos
  - 39,060 asaltos
  - 740 homicidios

### Proceso de ETL (Extract, Transform, Load)
1. **Extract**: Carga del CSV original
2. **Transform**: 
   - Validación de coordenadas
   - Clasificación de delitos
   - Filtrado por fecha y tipo
3. **Load**: Generación de GeoJSON optimizado (~30MB)

---

## 5. FUNCIONALIDADES IMPLEMENTADAS (4-5 minutos)

### A. Mapa de Calor Interactivo
**¿Qué es?**
- Visualización de densidad de delitos usando gradiente de colores

**Características técnicas**:
- **Normalización por tiempo**: Calcula delitos por mes (no solo acumulación)
- **Agrupación espacial**: Grid de 500m x 500m para optimizar rendimiento
- **Normalización por percentiles**: Distribución estadística para mejor visualización
- **10 niveles de clasificación**: Verde (seguro) → Amarillo → Naranja → Rojo (peligroso)
- **Controles ajustables**: Intensidad (10-100%), solo zonas críticas, optimización

**Problema resuelto**: 
- Sin normalización, todo aparecía en rojo (muchos datos históricos)
- Con normalización temporal y percentiles, se distinguen zonas realmente peligrosas

### B. Zonas de Seguridad
**¿Qué es?**
- Clasificación de CDMX en celdas de 1km² según nivel de riesgo

**Algoritmo de clasificación**:
1. Dividir CDMX en grid de celdas (1km² cada una)
2. Contar delitos por celda
3. Calcular densidad (delitos/km²)
4. Clasificar según umbrales:
   - Verde: 0 delitos (muy seguro)
   - Verde claro: < 5 delitos/km² (seguro)
   - Amarillo: 5-15 delitos/km² (moderado)
   - Naranja: 15-30 delitos/km² (peligroso)
   - Rojo: > 30 delitos/km² (muy peligroso)

**Característica especial**: 
- Zonas sin registros se muestran en verde (sin delitos = muy seguro)

### C. Sistema de Reportes Ciudadanos
**Flujo de usuario**:
1. Usuario hace clic en "Reportar Incidente"
2. Opciones de ubicación:
   - Geolocalización automática (GPS del dispositivo)
   - Selección manual en el mapa
3. Selección de tipo: robo, asalto, homicidio, acoso, otro
4. Descripción y foto opcionales
5. Reporte aparece inmediatamente en el mapa

**Implementación técnica**:
- Almacenamiento en LocalStorage (demo)
- Marcadores personalizados con iconos según tipo
- Animación pulsante para destacar reportes recientes

### D. Sistema de Filtros Avanzados
**Filtros disponibles**:
- Por tipo de delito (robos, asaltos, homicidios, acoso, otro)
- Por fecha (rango personalizable, último mes por defecto)
- Por alcaldía
- Toggle de capas (calor, zonas de seguridad, reportes ciudadanos)

**Implementación**:
- Filtrado en tiempo real usando `useMemo` para optimización
- Filtros independientes para datos oficiales y reportes ciudadanos

### E. Límites Exactos de CDMX
**Desafío técnico**:
- Mostrar solo el área de CDMX (no un rectángulo)
- Excluir áreas fuera de la ciudad

**Solución**:
- Carga de GeoJSON con límites de todas las alcaldías
- Unión de polígonos usando Turf.js para obtener límite exterior
- Filtrado de celdas usando `booleanPointInPolygon` (solo mostrar dentro de CDMX)

---

## 6. ASPECTOS TÉCNICOS DESTACADOS (3-4 minutos)

### A. Arquitectura del Código
**Patrones utilizados**:
- **Custom Hooks**: `useDelitosData()` encapsula lógica de datos
- **Composition Pattern**: Componentes pequeños y reutilizables
- **Memoization**: `useMemo` para cálculos costosos

**Estructura modular**:
```
src/
├── components/Map/     # Componentes del mapa
├── hooks/              # Lógica reutilizable
├── types/              # Definiciones TypeScript
└── utils/              # Utilidades
```

### B. Optimizaciones de Rendimiento
**Problema**: Procesar 55,561 puntos individuales es costoso

**Soluciones implementadas**:
1. **Agrupación espacial**: Reducir de 55k puntos a ~500-1000 celdas
2. **Muestreo**: Si hay >10k puntos, tomar muestra representativa
3. **Lazy Loading**: Plugin de heatmap se carga solo cuando se necesita
4. **Cleanup de capas**: Remover capas anteriores al actualizar

### C. Normalización de Datos
**Algoritmo del mapa de calor**:

1. **Agrupación por grid** (500m x 500m)
2. **Cálculo de tasa temporal**:
   ```typescript
   tasaPorMes = delitosEnCelda / mesesTotales
   factorConcentracion = diasConDelitos < 30 ? 1.5 : 1.0
   tasaNormalizada = tasaPorMes * factorConcentracion
   ```
3. **Normalización por percentiles**:
   - Calcular P10, P25, P50, P75, P90, P95, P99
   - Asignar intensidad según percentil (0.0 a 1.0)
4. **Gradiente de 10 niveles**: Verde → Rojo

### D. Operaciones Geoespaciales (Turf.js)
- **Union de polígonos**: Unir todas las alcaldías para límite exterior
- **Point-in-polygon**: Verificar si celdas están dentro de CDMX
- **Cálculos de área**: Densidad por km² considerando curvatura terrestre

---

## 7. CAPACIDADES GIS DEMOSTRADAS (2 minutos)

### 1. CAPTURA (Almacenamiento)
- **Reportes ciudadanos**: Coordenadas geográficas (lat, lng)
- **Datos oficiales**: Puntos con coordenadas exactas
- **Formato**: GeoJSON para interoperabilidad

### 2. CONSULTA (Visualización)
- **Mapa interactivo**: Zoom, pan, clic
- **Múltiples capas**: Calor, zonas, reportes (toggle on/off)
- **Tooltips informativos**: Información al hacer hover
- **Marcadores personalizados**: Iconos según tipo de delito

### 3. ANÁLISIS GEOGRÁFICO
- **Mapa de calor**: Análisis de densidad espacial
- **Clasificación de zonas**: Análisis de riesgo por grid
- **Operaciones geoespaciales**: Buffers (futuro), unions, point-in-polygon

---

## 8. INTERFAZ DE USUARIO (1 minuto)

### Diseño Moderno
- **Tailwind CSS**: Diseño responsive y moderno
- **Iconos**: Heroicons para elementos visuales
- **UX intuitiva**: 
  - Sidebar deslizable para filtros
  - Modal para reportes
  - Indicadores visuales claros

### Responsive Design
- Adaptable a dispositivos móviles
- Touch-friendly para tablets

---

## 9. RESULTADOS Y ESTADÍSTICAS (1 minuto)

### Datos Procesados
- ✅ 808,871 registros originales
- ✅ 777,535 con coordenadas válidas (96.1%)
- ✅ 55,561 delitos filtrados y procesados
- ✅ Reducción de ~200MB (CSV) a ~30MB (GeoJSON)

### Funcionalidades Operativas
- ✅ Mapa de calor con normalización temporal
- ✅ Zonas de seguridad con clasificación completa
- ✅ Sistema de reportes ciudadanos funcional
- ✅ Filtros avanzados operativos
- ✅ Límites exactos de CDMX

---

## 10. DESAFÍOS Y SOLUCIONES (2 minutos)

### Desafío 1: Rendimiento con muchos datos
**Problema**: 55k puntos hacían lento el mapa
**Solución**: Agrupación espacial + muestreo + memoización

### Desafío 2: Todo aparecía en rojo
**Problema**: Acumulación histórica mostraba todo como peligroso
**Solución**: Normalización temporal (delitos/mes) + percentiles

### Desafío 3: Límites exactos de CDMX
**Problema**: Mostrar forma exacta, no rectángulo
**Solución**: Unión de polígonos con Turf.js + point-in-polygon

### Desafío 4: Tipos de Leaflet.heat
**Problema**: No hay tipos TypeScript para leaflet.heat
**Solución**: Uso de `@ts-ignore` y tipado manual

---

## 11. MEJORAS FUTURAS (1 minuto)

### Corto Plazo
- Backend para reportes (actualmente LocalStorage)
- Buffers de riesgo (150m alrededor de delitos graves)
- Búsqueda por dirección/colonia

### Largo Plazo
- Machine Learning para predicción de riesgo
- App móvil nativa
- Integración con más fuentes de datos
- Sistema de alertas por proximidad

---

## 12. CONCLUSIONES (2 minutos)

### Logros Técnicos
- ✅ Procesamiento exitoso de dataset grande (808k registros)
- ✅ Implementación de 3 capacidades GIS requeridas
- ✅ Optimizaciones de rendimiento efectivas
- ✅ Código modular y mantenible

### Logros Funcionales
- ✅ Visualización clara de datos de seguridad
- ✅ Sistema colaborativo de reportes
- ✅ Análisis geoespacial útil para toma de decisiones

### Impacto Social
- **Transparencia**: Datos oficiales accesibles
- **Empoderamiento**: Ciudadanos informados
- **Colaboración**: Reportes en tiempo real
- **Prevención**: Identificación de zonas de riesgo

### Aprendizajes
- Importancia de normalización de datos
- Optimización de rendimiento en aplicaciones web
- Operaciones geoespaciales complejas
- Integración de múltiples librerías

---

## 13. DEMOSTRACIÓN (3-5 minutos)

### Pasos para la Demo
1. **Abrir la aplicación**
   - Mostrar interfaz inicial
   - Explicar layout

2. **Mostrar mapa de calor**
   - Activar capa de calor
   - Explicar gradiente de colores
   - Mostrar controles de intensidad

3. **Mostrar zonas de seguridad**
   - Activar capa de zonas
   - Explicar clasificación
   - Hover sobre celdas para ver tooltips

4. **Demostrar filtros**
   - Filtrar por tipo de delito
   - Filtrar por fecha
   - Filtrar por alcaldía

5. **Reportar un incidente**
   - Abrir formulario
   - Seleccionar ubicación en mapa
   - Completar reporte
   - Ver marcador en mapa

6. **Mostrar límites de CDMX**
   - Zoom out para ver límites exactos
   - Explicar que solo muestra área de CDMX

---

## 14. CIERRE (1 minuto)

### Agradecimiento
- "Gracias por su atención"
- "Quedo atento a sus preguntas y comentarios"

### Contacto/Repositorio
- Mencionar si hay repositorio GitHub
- Disponible para preguntas técnicas

---

## NOTAS ADICIONALES

### Tiempo Total Estimado: 15-20 minutos
- Presentación: 12-15 minutos
- Demo: 3-5 minutos
- Preguntas: 5-10 minutos

### Tips para la Presentación
- ✅ Hacer énfasis en los 3 requisitos GIS cumplidos
- ✅ Destacar los desafíos técnicos y soluciones
- ✅ Mostrar código si el profesor lo solicita
- ✅ Preparar respuestas sobre decisiones técnicas
- ✅ Tener la aplicación funcionando antes de empezar

### Preguntas Probables del Profesor
1. **"¿Por qué Leaflet y no OpenLayers o Mapbox?"**
   - Respuesta: Leaflet es open-source, ligero, fácil de usar y suficiente para nuestros requerimientos

2. **"¿Cómo funciona el algoritmo de normalización?"**
   - Respuesta: Usa percentiles estadísticos para distribuir valores en lugar de usar el máximo absoluto

3. **"¿Por qué LocalStorage y no una base de datos?"**
   - Respuesta: Es una demo. En producción usaríamos Firebase o Supabase

4. **"¿Cómo validas que las coordenadas estén en CDMX?"**
   - Respuesta: Verificación con Turf.js usando point-in-polygon con el polígono de límites de CDMX

5. **"¿Qué mejoras harías si tuvieras más tiempo?"**
   - Respuesta: Backend real, buffers de riesgo, modo "antes y después" con slider temporal

