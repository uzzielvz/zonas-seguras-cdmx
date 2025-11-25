"""
Script para convertir el CSV de delitos de la Fiscalía a GeoJSON
Filtra solo robos, asaltos y homicidios con coordenadas válidas
"""
import csv
import json
from datetime import datetime

def es_coordenada_valida(lon, lat):
    """Valida que las coordenadas estén en el rango de CDMX"""
    try:
        lon_f = float(lon) if lon else 0
        lat_f = float(lat) if lat else 0
        return (lon_f != 0 and lat_f != 0 and 
                -100 < lon_f < -98 and 19 < lat_f < 20)
    except:
        return False

def clasificar_delito(delito_str):
    """Clasifica el delito en robo, asalto o homicidio"""
    if not delito_str:
        return None
    
    delito_upper = delito_str.upper()
    
    # Homicidios (excluir culposos)
    if 'HOMICIDIO' in delito_upper and 'CULPOSO' not in delito_upper:
        return 'homicidio'
    
    # Asaltos (robos con violencia)
    if 'ROBO' in delito_upper and 'VIOLENCIA' in delito_upper:
        return 'asalto'
    
    # Robos (sin violencia o generales)
    if 'ROBO' in delito_upper:
        return 'robo'
    
    return None

def es_delito_grave(delito_str):
    """Determina si un delito es grave (para buffers)"""
    if not delito_str:
        return False
    
    delito_upper = delito_str.upper()
    graves = ['HOMICIDIO', 'FEMINICIDIO', 'VIOLACION', 'SECUESTRO']
    
    for grave in graves:
        if grave in delito_upper and 'CULPOSO' not in delito_upper:
            return True
    
    # Robos con violencia también son graves
    if 'ROBO' in delito_upper and 'VIOLENCIA' in delito_upper:
        return True
    
    return False

def procesar_csv(input_file, output_file, año_minimo=2019):
    """Procesa el CSV y genera un GeoJSON"""
    features = []
    contador = {
        'total': 0,
        'con_coordenadas': 0,
        'filtrados': 0,
        'robos': 0,
        'asaltos': 0,
        'homicidios': 0
    }
    
    print(f"Procesando {input_file}...")
    print(f"Filtrando delitos desde {año_minimo} en adelante...\n")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            contador['total'] += 1
            
            # Validar coordenadas
            lon = row.get('longitud', '').strip()
            lat = row.get('latitud', '').strip()
            
            if not es_coordenada_valida(lon, lat):
                continue
            
            contador['con_coordenadas'] += 1
            
            # Validar fecha
            fecha_str = row.get('FechaHecho', '').strip()
            if not fecha_str or fecha_str == 'NA':
                continue
            
            try:
                fecha = datetime.strptime(fecha_str, '%Y-%m-%d')
                if fecha.year < año_minimo:
                    continue
            except:
                continue
            
            # Clasificar delito
            delito = row.get('delito', '').strip()
            tipo = clasificar_delito(delito)
            
            if not tipo:
                continue
            
            contador['filtrados'] += 1
            contador[tipo + 's'] += 1  # robos, asaltos, homicidios
            
            # Crear feature GeoJSON
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(lon), float(lat)]
                },
                "properties": {
                    "fecha": fecha_str,
                    "delito": delito,
                    "categoria": row.get('categoria_delito', '').strip(),
                    "alcaldia": row.get('AlcaldiaHechos', '').strip(),
                    "colonia": row.get('colonia_datos', '').strip(),
                    "tipo": tipo,
                    "es_grave": es_delito_grave(delito),
                    "hora": row.get('HoraHecho', '').strip(),
                    "año": fecha.year,
                    "mes": fecha.month
                }
            }
            
            features.append(feature)
            
            # Mostrar progreso cada 10k registros
            if contador['filtrados'] % 10000 == 0:
                print(f"  Procesados: {contador['filtrados']:,} delitos válidos...")
    
    # Crear FeatureCollection
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    # Guardar GeoJSON
    print(f"\nGuardando GeoJSON en {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, ensure_ascii=False, indent=2)
    
    # Mostrar estadísticas
    print("\n" + "="*80)
    print("ESTADÍSTICAS")
    print("="*80)
    print(f"Total de registros en CSV: {contador['total']:,}")
    print(f"Registros con coordenadas válidas: {contador['con_coordenadas']:,}")
    print(f"Delitos filtrados (robos/asaltos/homicidios desde {año_minimo}): {contador['filtrados']:,}")
    print(f"\nDesglose por tipo:")
    print(f"  - Robos: {contador['robos']:,}")
    print(f"  - Asaltos: {contador['asaltos']:,}")
    print(f"  - Homicidios: {contador['homicidios']:,}")
    print(f"\nGeoJSON guardado exitosamente en: {output_file}")
    print("="*80)

if __name__ == '__main__':
    input_file = 'data/da_carpetas-de-investigacion-pgj-cdmx (1).csv'
    output_file = 'data/delitos-cdmx.geojson'
    
    try:
        procesar_csv(input_file, output_file, año_minimo=2019)
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo {input_file}")
        print("Asegúrate de que el CSV esté en la carpeta data/")
    except Exception as e:
        print(f"Error: {e}")

