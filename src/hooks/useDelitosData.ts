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
    let datos = delitosFiltrados

    // Muestreo: reducir puntos si hay muchos (mejor rendimiento)
    if (muestreo && datos.length > 10000) {
      // Tomar cada N-ésimo punto
      const paso = Math.ceil(datos.length / 10000)
      datos = datos.filter((_, index) => index % paso === 0)
      console.log(`📊 Muestreo aplicado: ${datos.length} puntos de ${delitosFiltrados.length}`)
    }

    // Si solo zonas críticas, agrupar por área y filtrar
    if (soloZonasCriticas) {
      // Agrupar puntos cercanos y solo mostrar áreas con alta densidad
      const grupos = new Map<string, { lat: number; lng: number; count: number }>()
      const umbralDistancia = 0.01 // ~1km
      
      datos.forEach((delito) => {
        const lat = delito.coordenadas[0]
        const lng = delito.coordenadas[1]
        const grupoKey = `${Math.round(lat / umbralDistancia)}_${Math.round(lng / umbralDistancia)}`
        
        if (!grupos.has(grupoKey)) {
          grupos.set(grupoKey, { lat, lng, count: 0 })
        }
        grupos.get(grupoKey)!.count++
      })

      // Solo mantener grupos con al menos 10 delitos (zonas críticas)
      const zonasCriticas: Delito[] = []
      grupos.forEach((grupo) => {
        if (grupo.count >= 10) {
          zonasCriticas.push({
            id: `zona-critica-${grupo.lat}-${grupo.lng}`,
            coordenadas: [grupo.lat, grupo.lng] as [number, number],
            tipo: 'robo' as TipoDelito,
            fecha: '',
            esGrave: true,
            delito: `Zona crítica (${grupo.count} delitos)`,
          })
        }
      })
      
      datos = zonasCriticas
      console.log(`🎯 Zonas críticas: ${datos.length} áreas de alta densidad`)
    }

    return datos.map((delito) => [
      delito.coordenadas[0], // lat
      delito.coordenadas[1], // lng
      1.0, // intensidad
    ])
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

