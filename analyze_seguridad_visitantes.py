import csv
from collections import Counter
from datetime import datetime
import re

# Delitos relevantes para visitantes (robos, asaltos, homicidios)
delitos_visitantes = {
    'ROBOS': [
        'ROBO A TRANSEUNTE',
        'ROBO DE OBJETOS',
        'ROBO A NEGOCIO',
        'ROBO DE VEHICULO',
        'ROBO DE CELULAR',
        'ROBO A PASAJERO',
        'ROBO A CUENTAHABIENTE',
        'ROBO A CASA HABITACION'
    ],
    'ASALTOS': [
        'ROBO.*CON VIOLENCIA',
        'ASALTO'
    ],
    'HOMICIDIOS': [
        'HOMICIDIO'
    ]
}

# Contadores
registros_2019 = 0
con_coordenadas = 0
delitos_visitantes_counter = Counter()
delitos_por_tipo = {
    'ROBOS': Counter(),
    'ASALTOS': Counter(),
    'HOMICIDIOS': Counter()
}
delitos_detalle = []

print("Analizando delitos relevantes para visitantes (robos, asaltos, homicidios)...\n")

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
                
                delito = row.get('delito', '').strip().upper()
                if not delito:
                    continue
                
                # Verificar coordenadas
                try:
                    lon = float(row.get('longitud', 0) or 0)
                    lat = float(row.get('latitud', 0) or 0)
                    tiene_coords = (lon != 0 and lat != 0 and -100 < lon < -98 and 19 < lat < 20)
                except:
                    tiene_coords = False
                
                # Clasificar delito
                tipo_encontrado = None
                
                # Homicidios (más específico primero)
                if 'HOMICIDIO' in delito and 'CULPOSO' not in delito:
                    tipo_encontrado = 'HOMICIDIOS'
                    delitos_por_tipo['HOMICIDIOS'][delito] += 1
                
                # Asaltos (robos con violencia)
                elif 'ROBO' in delito and 'VIOLENCIA' in delito:
                    tipo_encontrado = 'ASALTOS'
                    delitos_por_tipo['ASALTOS'][delito] += 1
                
                # Robos (sin violencia o generales)
                elif 'ROBO' in delito:
                    tipo_encontrado = 'ROBOS'
                    delitos_por_tipo['ROBOS'][delito] += 1
                
                if tipo_encontrado and tiene_coords:
                    delitos_visitantes_counter[delito] += 1
                    con_coordenadas += 1
                    delitos_detalle.append({
                        'tipo': tipo_encontrado,
                        'delito': row.get('delito', ''),
                        'fecha': fecha_str,
                        'lon': lon,
                        'lat': lat,
                        'alcaldia': row.get('AlcaldiaHechos', ''),
                        'colonia': row.get('colonia_datos', '')
                    })
        except:
            pass
        
        if registros_2019 % 50000 == 0 and registros_2019 > 0:
            print(f"  Procesados: {registros_2019:,} registros desde 2019...")

print(f"\n{'='*80}")
print("ANÁLISIS DE DELITOS PARA VISITANTES (2019)")
print(f"{'='*80}")
print(f"Total de registros desde 2019: {registros_2019:,}")

total_robos = sum(delitos_por_tipo['ROBOS'].values())
total_asaltos = sum(delitos_por_tipo['ASALTOS'].values())
total_homicidios = sum(delitos_por_tipo['HOMICIDIOS'].values())
total_general = total_robos + total_asaltos + total_homicidios

print(f"\nDelitos relevantes con coordenadas válidas: {con_coordenadas:,}")
print(f"\nDesglose:")
print(f"  - ROBOS (sin violencia): {total_robos:,}")
print(f"  - ASALTOS (con violencia): {total_asaltos:,}")
print(f"  - HOMICIDIOS: {total_homicidios:,}")
print(f"  - TOTAL: {total_general:,}")

print(f"\n{'='*80}")
print("TOP 10 ROBOS (sin violencia)")
print(f"{'='*80}")
for i, (delito, count) in enumerate(delitos_por_tipo['ROBOS'].most_common(10), 1):
    print(f"{i:2}. {delito[:70]:<70} {count:>6,}")

print(f"\n{'='*80}")
print("TOP 10 ASALTOS (con violencia)")
print(f"{'='*80}")
for i, (delito, count) in enumerate(delitos_por_tipo['ASALTOS'].most_common(10), 1):
    print(f"{i:2}. {delito[:70]:<70} {count:>6,}")

print(f"\n{'='*80}")
print("TIPOS DE HOMICIDIOS")
print(f"{'='*80}")
for i, (delito, count) in enumerate(delitos_por_tipo['HOMICIDIOS'].most_common(), 1):
    print(f"{i:2}. {delito[:70]:<70} {count:>6,}")

# Análisis por alcaldía
print(f"\n{'='*80}")
print("TOP 15 ALCALDÍAS CON MÁS DELITOS (robos, asaltos, homicidios)")
print(f"{'='*80}")
alcaldias_counter = Counter()
for d in delitos_detalle:
    if d['alcaldia'] and d['alcaldia'].upper() != 'NA':
        alcaldias_counter[d['alcaldia']] += 1

for i, (alcaldia, count) in enumerate(alcaldias_counter.most_common(15), 1):
    print(f"{i:2}. {alcaldia:<40} {count:>6,}")

# Análisis de delitos graves para buffers (homicidios + asaltos más graves)
print(f"\n{'='*80}")
print("DELITOS GRAVES PARA BUFFERS DE RIESGO")
print(f"{'='*80}")
delitos_graves_buffers = []
for d in delitos_detalle:
    if d['tipo'] == 'HOMICIDIOS':
        delitos_graves_buffers.append(d)
    elif d['tipo'] == 'ASALTOS' and any(x in d['delito'].upper() for x in [
        'TRANSEUNTE', 'PASAJERO', 'TAXI', 'METRO', 'MICROBUS', 'CASA HABITACION'
    ]):
        delitos_graves_buffers.append(d)

print(f"Total de delitos graves para buffers: {len(delitos_graves_buffers):,}")
print(f"  - Homicidios: {total_homicidios:,}")
print(f"  - Asaltos graves (transeúnte, pasajero, casa): {len(delitos_graves_buffers) - total_homicidios:,}")


