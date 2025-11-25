// Tipos para coordenadas
export type Coordinates = [number, number] // [latitud, longitud]

// Tipos de delitos
export type TipoDelito = 'homicidio' | 'asalto' | 'robo'

// Categoría de delito
export interface CategoriaDelito {
  id: string
  nombre: string
  color: string
  icono?: string
}

// Delito desde datos oficiales
export interface Delito {
  id: string
  tipo: TipoDelito
  fecha: string
  hora?: string
  coordenadas: Coordinates
  alcaldia?: string
  colonia?: string
  delito: string
  categoria?: string
  esGrave: boolean // Para determinar si se muestra buffer
}

// Reporte ciudadano
export interface ReporteCiudadano {
  id: string
  tipo: TipoDelito | 'acoso' | 'otro'
  coordenadas: Coordinates
  fecha: string
  descripcion?: string
  foto?: string
  verificado: boolean
}

// Filtros del mapa
export interface FiltrosMapa {
  tiposDelito: TipoDelito[]
  mostrarAcoso: boolean
  mostrarOtro: boolean
  mostrarCalor: boolean
  mostrarBuffers: boolean
  mostrarReportes: boolean
  alcaldia?: string
  fechaInicio?: string
  fechaFin?: string
  radio?: number // Radio en metros para búsqueda
}

