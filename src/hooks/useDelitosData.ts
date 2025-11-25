import { useState, useEffect, useMemo } from 'react'
import { Delito, TipoDelito, FiltrosMapa } from '../types/map'
import * as GeoJSON from 'geojson'

interface DelitoGeoJSON extends GeoJSON.Feature {
  geometry: GeoJSON.Point
  properties: {
    fecha: string
    delito: string
    categoria?: string
    alcaldia?: string
    colonia?: string
    tipo: string
    es_grave: boolean
    hora?: string
    año?: number
    mes?: number
  }
}

export function useDelitosData() {
  const [delitos, setDelitos] = useState<Delito[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDelitos = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data/delitos-cdmx.geojson')
        
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo GeoJSON')
        }
        
        const data: GeoJSON.FeatureCollection = await response.json()
        
        // Convertir GeoJSON a formato Delito
        const delitosConvertidos: Delito[] = data.features.map((feature, index) => {
          const props = (feature as DelitoGeoJSON).properties
          const coords = feature.geometry.coordinates
          
          return {
            id: `delito-${index}-${Date.now()}`,
            tipo: props.tipo as TipoDelito,
            fecha: props.fecha,
            hora: props.hora,
            coordenadas: [coords[1], coords[0]] as [number, number], // [lat, lng]
            alcaldia: props.alcaldia,
            colonia: props.colonia,
            delito: props.delito,
            categoria: props.categoria,
            esGrave: props.es_grave,
          }
        })
        
        setDelitos(delitosConvertidos)
        console.log(`✅ Cargados ${delitosConvertidos.length} delitos`)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('❌ Error cargando delitos:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDelitos()
  }, [])

  const filtrarDelitos = (filtros: FiltrosMapa): Delito[] => {
    return delitos.filter((delito) => {
      // Filtrar por tipo
      if (!filtros.tiposDelito.includes(delito.tipo)) {
        return false
      }

      // Filtrar por fecha (si no hay filtro, mostrar todos desde 2019)
      const fechaDelito = new Date(delito.fecha)
      const ahora = new Date()
      
      const fechaFin = filtros.fechaFin 
        ? new Date(filtros.fechaFin)
        : ahora // Hasta hoy
      
      // Si no hay fecha inicio, mostrar todos desde 2019 (no solo últimos 30 días)
      const fechaInicio = filtros.fechaInicio
        ? new Date(filtros.fechaInicio)
        : new Date('2019-01-01') // Desde 2019 por defecto
      
      if (fechaDelito < fechaInicio) return false
      if (fechaDelito > fechaFin) return false

      // Filtrar por alcaldía (si está definida)
      if (filtros.alcaldia && delito.alcaldia) {
        const alcaldiaNormalizada = delito.alcaldia.toLowerCase().replace(/\s+/g, '-')
        if (alcaldiaNormalizada !== filtros.alcaldia.toLowerCase()) {
          return false
        }
      }

      return true
    })
  }

  const getHeatmapData = (
    delitosFiltrados: Delito[], 
    soloZonasCriticas: boolean = false,
    muestreo: boolean = false
  ): Array<[number, number, number]> => {
    if (delitosFiltrados.length === 0) {
      return []
    }

    // Calcular el rango de fechas para normalización
    const fechas = delitosFiltrados
      .map(d => new Date(d.fecha).getTime())
      .filter(t => !isNaN(t))
      .sort((a, b) => a - b)
    
    const fechaInicio = fechas.length > 0 ? new Date(fechas[0]) : new Date()
    const fechaFin = fechas.length > 0 ? new Date(fechas[fechas.length - 1]) : new Date()
    
    // Calcular días entre primera y última fecha (mínimo 1 día)
    const diasTotales = Math.max(1, Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)))
    const mesesTotales = Math.max(1, diasTotales / 30.44) // Promedio de días por mes
    const añosTotales = Math.max(1, diasTotales / 365.25) // Años con días bisiestos

    console.log(`📅 Rango de fechas: ${fechaInicio.toLocaleDateString()} - ${fechaFin.toLocaleDateString()}`)
    console.log(`📊 Período: ${diasTotales} días (${mesesTotales.toFixed(1)} meses, ${añosTotales.toFixed(2)} años)`)

    // Agrupar delitos por ubicación (grid de ~500m)
    const grupos = new Map<string, {
      lat: number
      lng: number
      delitos: Delito[]
      fechas: number[]
    }>()
    
    const gridSize = 0.005 // ~500 metros
    let datos = delitosFiltrados

    // Muestreo: reducir puntos si hay muchos (mejor rendimiento)
    if (muestreo && datos.length > 10000) {
      // Tomar cada N-ésimo punto
      const paso = Math.ceil(datos.length / 10000)
      datos = datos.filter((_, index) => index % paso === 0)
      console.log(`📊 Muestreo aplicado: ${datos.length} puntos de ${delitosFiltrados.length}`)
    }

    // Agrupar por grid
    datos.forEach((delito) => {
      const lat = delito.coordenadas[0]
      const lng = delito.coordenadas[1]
      const gridLat = Math.round(lat / gridSize) * gridSize
      const gridLng = Math.round(lng / gridSize) * gridSize
      const grupoKey = `${gridLat.toFixed(4)}_${gridLng.toFixed(4)}`
      
      if (!grupos.has(grupoKey)) {
        grupos.set(grupoKey, {
          lat: gridLat,
          lng: gridLng,
          delitos: [],
          fechas: []
        })
      }
      
      const grupo = grupos.get(grupoKey)!
      grupo.delitos.push(delito)
      const fechaTime = new Date(delito.fecha).getTime()
      if (!isNaN(fechaTime)) {
        grupo.fechas.push(fechaTime)
      }
    })

    // Calcular intensidad normalizada por tiempo para cada grupo
    const puntosCalor: Array<[number, number, number]> = []
    let maxTasa = 0

    grupos.forEach((grupo) => {
      const count = grupo.delitos.length
      
      if (count === 0) return
      
      // Calcular tasa de delitos por día
      // Si todos los delitos están en el mismo día, la tasa es alta
      // Si están distribuidos en muchos días, la tasa es menor
      const fechasUnicas = [...new Set(grupo.fechas)]
      const diasConDelitos = Math.max(fechasUnicas.length, 1)
      
      // Opción 1: Tasa por día (delitos por día en esa zona)
      // Esto penaliza zonas con delitos distribuidos en muchos días
      const tasaPorDia = count / diasConDelitos
      
      // Opción 2: Tasa por mes (más estable para períodos largos)
      // Divide el total de delitos entre los meses del período
      const tasaPorMes = count / mesesTotales
      
      // Opción 3: Tasa por año (para comparar zonas a largo plazo)
      const tasaPorAño = count / añosTotales
      
      // Usar la tasa por mes como indicador principal (más estable)
      // Multiplicar por un factor para que zonas con alta concentración temporal
      // tengan mayor intensidad
      const factorConcentracion = diasConDelitos < 30 ? 1.5 : 1.0 // Bonus si está concentrado
      const tasaNormalizada = tasaPorMes * factorConcentracion
      
      maxTasa = Math.max(maxTasa, tasaNormalizada)
      
      puntosCalor.push([
        grupo.lat,
        grupo.lng,
        tasaNormalizada
      ])
    })

    // Si solo zonas críticas, filtrar por umbral
    let puntosFinales = puntosCalor
    
    if (soloZonasCriticas) {
      // Calcular percentil 75 como umbral de zona crítica
      const tasas = puntosCalor.map(p => p[2]).sort((a, b) => b - a)
      const umbralCritico = tasas[Math.floor(tasas.length * 0.25)] // Top 25%
      
      puntosFinales = puntosCalor.filter(p => p[2] >= umbralCritico)
      console.log(`🎯 Zonas críticas: ${puntosFinales.length} áreas de ${puntosCalor.length} totales`)
    }

    // Normalizar intensidades usando percentiles para mejor distribución
    if (puntosFinales.length > 0 && maxTasa > 0) {
      // Calcular percentiles para una mejor distribución
      const tasas = puntosFinales.map(p => p[2]).sort((a, b) => a - b)
      const p10 = tasas[Math.floor(tasas.length * 0.10)] || 0
      const p25 = tasas[Math.floor(tasas.length * 0.25)] || 0
      const p50 = tasas[Math.floor(tasas.length * 0.50)] || 0
      const p75 = tasas[Math.floor(tasas.length * 0.75)] || 0
      const p90 = tasas[Math.floor(tasas.length * 0.90)] || 0
      const p95 = tasas[Math.floor(tasas.length * 0.95)] || 0
      const p99 = tasas[Math.floor(tasas.length * 0.99)] || maxTasa

      console.log(`📊 Percentiles de tasa: P10=${p10.toFixed(2)}, P25=${p25.toFixed(2)}, P50=${p50.toFixed(2)}, P75=${p75.toFixed(2)}, P90=${p90.toFixed(2)}, P95=${p95.toFixed(2)}, P99=${p99.toFixed(2)}`)

      // Normalizar usando percentiles para mejor distribución
      // Esto hace que los valores bajos se vean más diferenciados
      puntosFinales = puntosFinales.map(([lat, lng, tasa]) => {
        // Usar percentiles para clasificar con interpolación suave
        let intensidadNormalizada = 0
        
        if (p10 > 0 && tasa <= p10) {
          // Muy bajo: 0.0 - 0.1 (verde)
          intensidadNormalizada = (tasa / p10) * 0.1
        } else if (p25 > p10 && tasa <= p25) {
          // Bajo: 0.1 - 0.2 (verde claro)
          intensidadNormalizada = 0.1 + ((tasa - p10) / (p25 - p10)) * 0.1
        } else if (p50 > p25 && tasa <= p50) {
          // Medio-bajo: 0.2 - 0.35 (verde muy claro)
          intensidadNormalizada = 0.2 + ((tasa - p25) / (p50 - p25)) * 0.15
        } else if (p75 > p50 && tasa <= p75) {
          // Medio: 0.35 - 0.5 (azul claro a amarillo)
          intensidadNormalizada = 0.35 + ((tasa - p50) / (p75 - p50)) * 0.15
        } else if (p90 > p75 && tasa <= p90) {
          // Medio-alto: 0.5 - 0.65 (amarillo a naranja claro)
          intensidadNormalizada = 0.5 + ((tasa - p75) / (p90 - p75)) * 0.15
        } else if (p95 > p90 && tasa <= p95) {
          // Alto: 0.65 - 0.8 (naranja)
          intensidadNormalizada = 0.65 + ((tasa - p90) / (p95 - p90)) * 0.15
        } else if (p99 > p95 && tasa <= p99) {
          // Muy alto: 0.8 - 0.95 (naranja-rojo)
          intensidadNormalizada = 0.8 + ((tasa - p95) / (p99 - p95)) * 0.15
        } else {
          // Extremo: 0.95 - 1.0 (rojo oscuro)
          const diff = maxTasa - p99
          if (diff > 0) {
            intensidadNormalizada = 0.95 + Math.min(0.05, ((tasa - p99) / diff) * 0.05)
          } else {
            intensidadNormalizada = 0.95
          }
        }

        return [lat, lng, Math.min(1.0, Math.max(0.0, intensidadNormalizada))]
      })
    }

    console.log(`🔥 Mapa de calor: ${puntosFinales.length} puntos, tasa máxima: ${maxTasa.toFixed(2)} delitos/mes`)

    return puntosFinales
  }

  return {
    delitos,
    loading,
    error,
    filtrarDelitos,
    getHeatmapData: (delitos: Delito[], soloZonasCriticas?: boolean, muestreo?: boolean) => 
      getHeatmapData(delitos, soloZonasCriticas, muestreo),
  }
}

