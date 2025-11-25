import { ReporteCiudadano } from '../types/map'

const STORAGE_KEY = 'zonasegura-reportes'

export function guardarReporte(reporte: ReporteCiudadano): void {
  const reportes = obtenerReportes()
  reportes.push(reporte)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reportes))
}

export function obtenerReportes(): ReporteCiudadano[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []
  try {
    return JSON.parse(data) as ReporteCiudadano[]
  } catch {
    return []
  }
}

export function eliminarReporte(id: string): void {
  const reportes = obtenerReportes().filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reportes))
}

export function limpiarReportes(): void {
  localStorage.removeItem(STORAGE_KEY)
}

