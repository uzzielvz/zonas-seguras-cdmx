# Análisis de Datos - Fiscalía General de Justicia CDMX

## 📊 Resumen Ejecutivo

Este documento contiene el análisis completo de los datos de delitos de la Fiscalía General de Justicia de la Ciudad de México, enfocado en el desarrollo del proyecto **ZonaSegura CDMX - Mapa colaborativo de seguridad ciudadana**.

---

## 📁 Información del Dataset

- **Archivo**: `da_carpetas-de-investigacion-pgj-cdmx (1).csv`
- **Total de registros**: 808,871
- **Tamaño del archivo**: >200 MB
- **Rango de fechas**: 1906 - 2019 (algunas fechas antiguas pueden ser errores de captura)
- **Formato**: CSV con 19 columnas

---

## 🗂️ Estructura de Columnas

El dataset contiene las siguientes columnas:

1. `ao_hechos` - Año del hecho
2. `mes_hechos` - Mes del hecho
3. `FechaHecho` - Fecha del delito (formato: YYYY-MM-DD)
4. `HoraHecho` - Hora del delito (formato: HH:MM:SS)
5. `ao_inicio` - Año de inicio de investigación
6. `mes_inicio` - Mes de inicio de investigación
7. `FechaInicio` - Fecha de inicio de investigación
8. `HoraInicio` - Hora de inicio de investigación
9. `delito` - Tipo de delito (descripción completa)
10. `fiscalia` - Fiscalía responsable
11. `agencia` - Agencia investigadora
12. `unidad_investigacion` - Unidad de investigación
13. `categoria_delito` - Categoría del delito
14. `AlcaldiaHechos` - Alcaldía donde ocurrió el delito
15. `municipio_hechos` - Municipio
16. `colonia_datos` - Colonia
17. `fgj_colonia_registro` - Colonia según registro FGJ
18. `longitud` - Coordenada de longitud (formato decimal)
19. `latitud` - Coordenada de latitud (formato decimal)

---

## 📍 Análisis de Coordenadas Geográficas

### Datos Generales (Todos los registros)
- **Total de registros**: 808,871
- **Registros con coordenadas válidas**: 777,535 (96.1%)
- **Registros sin coordenadas**: 31,336 (3.9%)

**Criterio de validez**: 
- Longitud entre -100 y -98 (rango de CDMX)
- Latitud entre 19 y 20 (rango de CDMX)
- Valores diferentes de 0

### Datos desde 2019
- **Total de registros desde 2019**: 113,415
- **Con coordenadas válidas**: 109,569 (96.6%)
- **Sin coordenadas**: 3,846 (3.4%)

---

## 📅 Análisis Temporal

### Rango de Fechas
- **Fecha más antigua**: 1906-06-02 (posible error de captura)
- **Fecha más reciente**: 2019-06-30
- **Rango total**: 113 años (41,301 días)

### Registros por Año (2019)
- **Total de registros en 2019**: 113,415
- **Período**: Enero - Junio 2019 (6 meses)

---

## 🏛️ Distribución por Alcaldía

### Top 15 Alcaldías con Más Delitos (Todos los tipos)

| # | Alcaldía | Total de Delitos |
|---|----------|------------------|
| 1 | CUAUHTEMOC | 131,397 |
| 2 | IZTAPALAPA | 119,926 |
| 3 | GUSTAVO A. MADERO | 80,097 |
| 4 | BENITO JUAREZ | 70,599 |
| 5 | COYOACAN | 54,235 |
| 6 | MIGUEL HIDALGO | 53,688 |
| 7 | ALVARO OBREGON | 52,568 |
| 8 | VENUSTIANO CARRANZA | 46,224 |
| 9 | TLALPAN | 46,179 |
| 10 | AZCAPOTZALCO | 39,435 |
| 11 | IZTACALCO | 34,407 |
| 12 | XOCHIMILCO | 24,639 |
| 13 | TLAHUAC | 18,197 |
| 14 | LA MAGDALENA CONTRERAS | 12,064 |
| 15 | CUAJIMALPA DE MORELOS | 11,393 |

### Top 15 Alcaldías - Delitos para Visitantes (Robos, Asaltos, Homicidios - 2019)

| # | Alcaldía | Total de Delitos |
|---|----------|------------------|
| 1 | IZTAPALAPA | 8,939 |
| 2 | CUAUHTEMOC | 8,446 |
| 3 | GUSTAVO A. MADERO | 5,534 |
| 4 | BENITO JUAREZ | 5,307 |
| 5 | MIGUEL HIDALGO | 4,306 |
| 6 | ALVARO OBREGON | 3,989 |
| 7 | COYOACAN | 3,367 |
| 8 | VENUSTIANO CARRANZA | 3,315 |
| 9 | TLALPAN | 2,925 |
| 10 | AZCAPOTZALCO | 2,704 |
| 11 | IZTACALCO | 2,685 |
| 12 | XOCHIMILCO | 1,491 |
| 13 | TLAHUAC | 1,117 |
| 14 | CUAJIMALPA DE MORELOS | 655 |
| 15 | LA MAGDALENA CONTRERAS | 589 |

---

## 🚨 Categorías de Delitos

### Todas las Categorías (Frecuencia)

| Categoría | Total de Registros |
|-----------|-------------------|
| DELITO DE BAJO IMPACTO | 633,851 |
| HECHO NO DELICTIVO | 53,112 |
| ROBO DE VEHÍCULO CON Y SIN VIOLENCIA | 42,699 |
| ROBO A TRANSEUNTE EN VÍA PÚBLICA CON Y SIN VIOLENCIA | 33,528 |
| ROBO A NEGOCIO CON VIOLENCIA | 11,578 |
| ROBO A REPARTIDOR CON Y SIN VIOLENCIA | 7,346 |
| LESIONES DOLOSAS POR DISPARO DE ARMA DE FUEGO | 6,855 |
| ROBO A PASAJERO A BORDO DEL METRO CON Y SIN VIOLENCIA | 5,497 |
| HOMICIDIO DOLOSO | 4,547 |
| ROBO A PASAJERO A BORDO DE MICROBUS CON Y SIN VIOLENCIA | 2,882 |
| VIOLACIÓN | 2,437 |
| ROBO A CASA HABITACIÓN CON VIOLENCIA | 1,839 |
| ROBO A CUENTAHABIENTE SALIENDO DEL CAJERO CON VIOLENCIA | 1,416 |
| ROBO A PASAJERO A BORDO DE TAXI CON VIOLENCIA | 739 |
| ROBO A TRANSPORTISTA CON Y SIN VIOLENCIA | 451 |
| SECUESTRO | 94 |

---

## 🔍 Análisis Enfocado: Delitos para Visitantes

### Enfoque del Proyecto
El proyecto se enfoca en **robos, asaltos y homicidios** ya que son los delitos más relevantes para visitantes que buscan evaluar la seguridad de las zonas que van a visitar.

### Datos Relevantes (2019)

- **Total de delitos relevantes con coordenadas**: 55,561
- **Robos (sin violencia)**: 15,849
- **Asaltos (con violencia)**: 39,428
- **Homicidios**: 843
- **TOTAL**: 56,120 delitos

### Top 10 Robos (Sin Violencia) - 2019

| # | Tipo de Delito | Total |
|---|----------------|-------|
| 1 | ROBO DE OBJETOS | 5,696 |
| 2 | ROBO DE ACCESORIOS DE AUTO | 4,323 |
| 3 | ROBO DE OBJETOS DEL INTERIOR DE UN VEHICULO | 3,095 |
| 4 | ROBO DE VEHICULO DE PEDALES | 842 |
| 5 | ROBO DE DINERO | 407 |
| 6 | ROBO DE DOCUMENTOS | 395 |
| 7 | ROBO DE PLACA DE AUTOMOVIL | 326 |
| 8 | ROBO DE OBJETOS A ESCUELA | 266 |
| 9 | TENTATIVA DE ROBO | 190 |
| 10 | ROBO DE ANIMALES | 60 |

### Top 10 Asaltos (Con Violencia) - 2019

| # | Tipo de Delito | Total |
|---|----------------|-------|
| 1 | ROBO A NEGOCIO SIN VIOLENCIA | 7,863 |
| 2 | ROBO A TRANSEUNTE EN VIA PUBLICA CON VIOLENCIA | 7,219 |
| 3 | ROBO DE VEHICULO DE SERVICIO PARTICULAR SIN VIOLENCIA | 3,369 |
| 4 | ROBO A CASA HABITACION SIN VIOLENCIA | 2,932 |
| 5 | ROBO A NEGOCIO CON VIOLENCIA | 2,596 |
| 6 | ROBO A PASAJERO / CONDUCTOR DE VEHICULO CON VIOLENCIA | 2,121 |
| 7 | ROBO A PASAJERO A BORDO DE METRO SIN VIOLENCIA | 1,645 |
| 8 | ROBO DE VEHICULO DE SERVICIO PARTICULAR CON VIOLENCIA | 1,419 |
| 9 | ROBO A REPARTIDOR CON VIOLENCIA | 1,314 |
| 10 | ROBO A TRANSEUNTE EN VIA PUBLICA SIN VIOLENCIA | 1,037 |

**Nota**: Algunos delitos marcados como "SIN VIOLENCIA" aparecen en la categoría de asaltos debido a la clasificación del sistema. El más relevante para visitantes es **ROBO A TRANSEUNTE EN VIA PUBLICA CON VIOLENCIA** con 7,219 casos.

### Tipos de Homicidios - 2019

| # | Tipo de Delito | Total |
|---|----------------|-------|
| 1 | HOMICIDIO POR ARMA DE FUEGO | 571 |
| 2 | HOMICIDIO POR ARMA BLANCA | 98 |
| 3 | HOMICIDIO POR GOLPES | 70 |
| 4 | HOMICIDIOS INTENCIONALES (OTROS) | 61 |
| 5 | TENTATIVA DE HOMICIDIO | 41 |
| 6 | HOMICIDIO POR AHORCAMIENTO | 2 |

**Total de homicidios**: 843

---

## ⚠️ Delitos Graves para Buffers de Riesgo

### Definición
Los buffers de riesgo son áreas de 150 metros de radio alrededor de delitos graves que marcan zonas de alto riesgo, especialmente relevantes para evitar de noche.

### Delitos Graves Identificados (2019)

**Total de delitos graves para buffers**: 20,841

#### Desglose:
- **Homicidios**: 843
- **Asaltos graves** (transeúnte, pasajero, casa): 19,998

#### Tipos Específicos de Delitos Graves:

1. **HOMICIDIOS** (843 total)
   - Homicidio por arma de fuego: 571
   - Homicidio por arma blanca: 98
   - Homicidio por golpes: 70
   - Otros: 104

2. **ASALTOS GRAVES** (19,998 total)
   - Robo a transeúnte en vía pública con violencia: 7,219
   - Robo a negocio con violencia: 2,596
   - Robo de vehículo con violencia: 1,419
   - Robo a pasajero a bordo de taxi con violencia: 200
   - Robo a casa habitación con violencia: 342
   - Otros asaltos graves: 8,222

### Delitos Graves con Coordenadas Válidas
- **Total**: 13,798 de 14,235 (96.9%)
- **Homicidios con coordenadas**: ~817 de 843
- **Asaltos graves con coordenadas**: ~19,300 de 19,998

---

## 📊 Top 10 Delitos Más Frecuentes (Todos los Tipos - 2019)

| # | Tipo de Delito | Total |
|---|----------------|-------|
| 1 | VIOLENCIA FAMILIAR | 69,517 |
| 2 | ROBO DE OBJETOS | 52,214 |
| 3 | ROBO A NEGOCIO SIN VIOLENCIA | 51,426 |
| 4 | FRAUDE | 45,349 |
| 5 | DENUNCIA DE HECHOS | 44,433 |
| 6 | AMENAZAS | 37,415 |
| 7 | ROBO A TRANSEUNTE EN VIA PUBLICA CON VIOLENCIA | 29,254 |
| 8 | ROBO A TRANSEUNTE DE CELULAR CON VIOLENCIA | 25,960 |
| 9 | ROBO DE ACCESORIOS DE AUTO | 25,447 |
| 10 | ROBO DE OBJETOS DEL INTERIOR DE UN VEHICULO | 23,860 |

---

## 🎯 Recomendaciones para el Proyecto

### 1. Rango de Datos a Utilizar
- **Recomendación**: Usar solo datos de **2019** (113,415 registros)
- **Razón**: 
  - Más manejable para el demo (vs 808k totales)
  - Datos más recientes y relevantes
  - 96.6% tienen coordenadas válidas

### 2. Filtrado de Delitos
- **Enfoque**: Robos, Asaltos y Homicidios
- **Total de puntos**: 55,561 con coordenadas válidas
- **Ventaja**: Más relevante para visitantes, datos manejables

### 3. Buffers de Riesgo
- **Delitos a incluir**:
  - Todos los homicidios (843)
  - Asaltos graves:
    - Robo a transeúnte con violencia
    - Robo a pasajero (taxi, metro, microbús) con violencia
    - Robo a casa habitación con violencia
- **Total de buffers**: ~20,841
- **Radio**: 150 metros
- **Color**: Rojo semitransparente

### 4. Mapa de Calor
- **Datos**: Todos los robos, asaltos y homicidios (55,561 puntos)
- **Filtros disponibles**:
  - Por tipo (robos/asaltos/homicidios)
  - Por fecha (últimos 7 días, último mes, 2019 completo)
  - Por alcaldía

### 5. Estructura de Datos GeoJSON

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [longitud, latitud]
  },
  "properties": {
    "fecha": "2019-01-15",
    "delito": "ROBO A TRANSEUNTE EN VIA PUBLICA CON VIOLENCIA",
    "categoria": "ROBO A TRANSEUNTE EN VÍA PÚBLICA CON Y SIN VIOLENCIA",
    "alcaldia": "CUAUHTEMOC",
    "colonia": "CENTRO",
    "tipo": "ASALTO",
    "es_grave": true,
    "hora": "17:30:00"
  }
}
```

### 6. Iconos y Colores Sugeridos

- **Robos (sin violencia)**: 🔵 Azul claro
- **Asaltos (con violencia)**: 🟠 Naranja/Amarillo
- **Homicidios**: 🔴 Rojo
- **Reportes ciudadanos**: 🔴 Rojo brillante con borde pulsante
- **Buffers de riesgo**: 🔴 Rojo semitransparente (opacidad 0.3)

### 7. Optimizaciones Técnicas

- **Clustering**: Para manejar 55k+ puntos en el mapa
- **Carga progresiva**: Por alcaldía o nivel de zoom
- **Muestreo**: Para mapa de calor si es necesario
- **Formato**: Convertir CSV a GeoJSON para mejor rendimiento

---

## 📈 Estadísticas Clave

### Para Visitantes (2019)

- **Total de delitos relevantes**: 56,120
- **Con coordenadas válidas**: 55,561 (99.0%)
- **Promedio por día** (6 meses): ~310 delitos/día
- **Zonas más peligrosas**:
  1. Iztapalapa: 8,939 delitos
  2. Cuauhtémoc: 8,446 delitos
  3. Gustavo A. Madero: 5,534 delitos

### Delitos Graves

- **Total**: 20,841
- **Con coordenadas**: ~20,000 (96%)
- **Promedio por día**: ~115 delitos graves/día
- **Homicidios por día**: ~4.7 homicidios/día

---

## 🔧 Próximos Pasos Técnicos

1. **Conversión de CSV a GeoJSON**
   - Filtrar solo robos, asaltos y homicidios
   - Validar coordenadas
   - Agregar propiedades necesarias

2. **Creación de archivos GeoJSON separados**:
   - `delitos_oficiales.geojson` - Todos los delitos (55,561 puntos)
   - `delitos_graves.geojson` - Solo para buffers (20,841 puntos)
   - Estructura optimizada para carga rápida

3. **Desarrollo de la aplicación web**:
   - Mapa base con Leaflet
   - Capa de mapa de calor
   - Capa de buffers de riesgo
   - Sistema de reportes ciudadanos
   - Filtros y controles

---

## 📝 Notas Importantes

1. **Calidad de datos**: 96.1% de los registros tienen coordenadas válidas, lo cual es excelente para visualización geográfica.

2. **Clasificación de delitos**: Algunos delitos marcados como "SIN VIOLENCIA" pueden aparecer en categorías de asaltos debido a la estructura del dataset original.

3. **Fechas antiguas**: Hay registros desde 1906 que probablemente son errores de captura. Se recomienda filtrar solo desde 2010 en adelante para análisis históricos.

4. **Datos incompletos**: Algunos registros tienen "NA" en campos como alcaldía o colonia, pero mantienen coordenadas válidas.

5. **Rendimiento**: Con 55k+ puntos, será necesario implementar clustering o carga progresiva para mantener buen rendimiento en el navegador.

---

## 📚 Referencias

- **Fuente de datos**: Fiscalía General de Justicia de la Ciudad de México (FGJ-CDMX)
- **Período de datos**: 2019 (Enero - Junio)
- **Formato original**: CSV
- **Formato objetivo**: GeoJSON

---

**Fecha de análisis**: 2024
**Versión del documento**: 1.0

