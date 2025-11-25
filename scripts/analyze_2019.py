import csv
from collections import Counter
from datetime import datetime
import re

# Contadores
registros_2019 = 0
con_coordenadas_2019 = 0
delitos_graves_2019 = Counter()
delitos_graves_detalle = []

# Definir delitos graves para buffers (más específicos)
delitos_graves_lista = [
    'HOMICIDIO DOLOSO',
    'HOMICIDIO POR ARMA DE FUEGO',
    'HOMICIDIO POR ARMA BLANCA',
    'FEMINICIDIO',
    'VIOLACION',
    'VIOLACION EQUIPARADA',
    'VIOLACION TUMULTUARIA',
    'SECUESTRO',
    'PLAGIO O SECUESTRO',
    'SECUESTRO EXPRESS',
    'ROBO A TRANSEUNTE EN VIA PUBLICA CON VIOLENCIA',
    'ROBO A TRANSEUNTE DE CELULAR CON VIOLENCIA',
    'ROBO A NEGOCIO CON VIOLENCIA',
    'ROBO A CASA HABITACION CON VIOLENCIA',
    'ROBO A CUENTAHABIENTE SALIENDO DEL CAJERO CON VIOLENCIA',
    'ROBO A PASAJERO A BORDO DEL METRO CON VIOLENCIA',
    'ROBO A PASAJERO A BORDO DE MICROBUS CON VIOLENCIA',
    'ROBO A PASAJERO A BORDO DE TAXI CON VIOLENCIA',
    'ROBO DE VEHICULO.*CON VIOLENCIA',
    'LESIONES DOLOSAS POR DISPARO DE ARMA DE FUEGO'
]

print("Analizando registros desde 2019...\n")

with open('data/da_carpetas-de-investigacion-pgj-cdmx (1).csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    
    for row in reader:
        fecha_str = row.get('FechaHecho', '').strip()
        if not fecha_str or fecha_str == 'NA':
            continue
        
        try:
            fecha = datetime.strptime(fecha_str, '%Y-%m-%d')
            if fecha.year >= 2019:
                registros_2019 += 1
                
                # Verificar coordenadas
                try:
                    lon = float(row.get('longitud', 0) or 0)
                    lat = float(row.get('latitud', 0) or 0)
                    if lon != 0 and lat != 0 and -100 < lon < -98 and 19 < lat < 20:
                        con_coordenadas_2019 += 1
                except:
                    pass
                
                # Verificar si es delito grave
                delito = row.get('delito', '').strip()
                for delito_grave in delitos_graves_lista:
                    if re.search(delito_grave.upper(), delito.upper()):
                        delitos_graves_2019[delito] += 1
                        delitos_graves_detalle.append({
                            'delito': delito,
                            'fecha': fecha_str,
                            'lon': row.get('longitud', ''),
                            'lat': row.get('latitud', ''),
                            'alcaldia': row.get('AlcaldiaHechos', '')
                        })
                        break
        except:
            pass
        
        if registros_2019 % 10000 == 0 and registros_2019 > 0:
            print(f"  Procesados: {registros_2019:,} registros desde 2019...")

print(f"\n{'='*80}")
print("ANÁLISIS DE REGISTROS DESDE 2019")
print(f"{'='*80}")
print(f"Total de registros desde 2019: {registros_2019:,}")
print(f"Con coordenadas válidas: {con_coordenadas_2019:,} ({con_coordenadas_2019/registros_2019*100:.1f}%)")

print(f"\n{'='*80}")
print("DELITOS GRAVES DESDE 2019 (para buffers de riesgo)")
print(f"{'='*80}")
total_graves = sum(delitos_graves_2019.values())
print(f"Total de delitos graves: {total_graves:,}")

# Agrupar por tipo
homicidios = sum(count for delito, count in delitos_graves_2019.items() if 'HOMICIDIO' in delito.upper())
feminicidios = sum(count for delito, count in delitos_graves_2019.items() if 'FEMINICIDIO' in delito.upper())
violaciones = sum(count for delito, count in delitos_graves_2019.items() if 'VIOLACION' in delito.upper() and 'CORRESPONDENCIA' not in delito.upper())
secuestros = sum(count for delito, count in delitos_graves_2019.items() if 'SECUESTRO' in delito.upper() or 'PLAGIO' in delito.upper())
robos_violencia = sum(count for delito, count in delitos_graves_2019.items() if 'ROBO' in delito.upper() and 'VIOLENCIA' in delito.upper())
lesiones_arma = sum(count for delito, count in delitos_graves_2019.items() if 'DISPARO' in delito.upper() or 'ARMA DE FUEGO' in delito.upper())

print(f"\nDesglose:")
print(f"  - Homicidios: {homicidios:,}")
print(f"  - Feminicidios: {feminicidios:,}")
print(f"  - Violaciones: {violaciones:,}")
print(f"  - Secuestros: {secuestros:,}")
print(f"  - Robos con violencia: {robos_violencia:,}")
print(f"  - Lesiones por arma de fuego: {lesiones_arma:,}")

print(f"\n{'='*80}")
print("TOP 15 DELITOS GRAVES MÁS FRECUENTES (2019)")
print(f"{'='*80}")
for i, (delito, count) in enumerate(delitos_graves_2019.most_common(15), 1):
    print(f"{i:2}. {delito[:65]:<65} {count:>6,}")

# Verificar cuántos delitos graves tienen coordenadas
graves_con_coords = sum(1 for d in delitos_graves_detalle if d['lon'] and d['lat'] and float(d['lon'] or 0) != 0)
print(f"\nDelitos graves con coordenadas válidas: {graves_con_coords:,} de {total_graves:,} ({graves_con_coords/total_graves*100:.1f}%)")


