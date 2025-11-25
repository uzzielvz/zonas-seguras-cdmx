import csv
from collections import Counter
from datetime import datetime

# Estadísticas
total_registros = 0
con_coordenadas = 0
sin_coordenadas = 0
delitos_counter = Counter()
categorias_counter = Counter()
alcaldias_counter = Counter()
fechas = []
delitos_graves_keywords = ['HOMICIDIO', 'FEMINICIDIO', 'VIOLACION', 'ROBO.*VIOLENCIA', 'SECUESTRO']

print("Analizando CSV... Esto puede tardar unos minutos...\n")

with open('data/da_carpetas-de-investigacion-pgj-cdmx (1).csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    
    for row in reader:
        total_registros += 1
        
        # Contar coordenadas válidas
        try:
            lon = float(row.get('longitud', 0) or 0)
            lat = float(row.get('latitud', 0) or 0)
            if lon != 0 and lat != 0 and -100 < lon < -98 and 19 < lat < 20:
                con_coordenadas += 1
            else:
                sin_coordenadas += 1
        except:
            sin_coordenadas += 1
        
        # Contar delitos
        delito = row.get('delito', '').strip()
        if delito:
            delitos_counter[delito] += 1
        
        # Contar categorías
        categoria = row.get('categoria_delito', '').strip()
        if categoria:
            categorias_counter[categoria] += 1
        
        # Contar alcaldías
        alcaldia = row.get('AlcaldiaHechos', '').strip()
        if alcaldia and alcaldia.upper() != 'NA':
            alcaldias_counter[alcaldia] += 1
        
        # Fechas
        fecha_str = row.get('FechaHecho', '').strip()
        if fecha_str and fecha_str != 'NA':
            try:
                fecha = datetime.strptime(fecha_str, '%Y-%m-%d')
                fechas.append(fecha)
            except:
                pass
        
        # Mostrar progreso cada 100k registros
        if total_registros % 100000 == 0:
            print(f"  Procesados: {total_registros:,} registros...")

print(f"\n{'='*80}")
print("RESUMEN GENERAL")
print(f"{'='*80}")
print(f"Total de registros: {total_registros:,}")
print(f"Registros con coordenadas válidas: {con_coordenadas:,} ({con_coordenadas/total_registros*100:.1f}%)")
print(f"Registros sin coordenadas: {sin_coordenadas:,} ({sin_coordenadas/total_registros*100:.1f}%)")

print(f"\n{'='*80}")
print("RANGO DE FECHAS")
print(f"{'='*80}")
if fechas:
    fechas.sort()
    print(f"Fecha más antigua: {fechas[0].strftime('%Y-%m-%d')}")
    print(f"Fecha más reciente: {fechas[-1].strftime('%Y-%m-%d')}")
    print(f"Rango: {(fechas[-1] - fechas[0]).days} días ({(fechas[-1].year - fechas[0].year)} años)")

print(f"\n{'='*80}")
print("TOP 10 TIPOS DE DELITOS MÁS FRECUENTES")
print(f"{'='*80}")
for i, (delito, count) in enumerate(delitos_counter.most_common(10), 1):
    print(f"{i:2}. {delito[:60]:<60} {count:>8,}")

print(f"\n{'='*80}")
print("TODAS LAS CATEGORÍAS DE DELITOS")
print(f"{'='*80}")
for categoria, count in categorias_counter.most_common():
    print(f"  {categoria:<50} {count:>8,}")

print(f"\n{'='*80}")
print("TOP 15 ALCALDÍAS CON MÁS DELITOS")
print(f"{'='*80}")
for i, (alcaldia, count) in enumerate(alcaldias_counter.most_common(15), 1):
    print(f"{i:2}. {alcaldia:<40} {count:>8,}")

print(f"\n{'='*80}")
print("ANÁLISIS DE DELITOS GRAVES (para buffers de riesgo)")
print(f"{'='*80}")
import re
delitos_graves = {}
for delito, count in delitos_counter.items():
    for keyword in delitos_graves_keywords:
        if re.search(keyword, delito.upper()):
            if keyword not in delitos_graves:
                delitos_graves[keyword] = []
            delitos_graves[keyword].append((delito, count))
            break

for keyword, lista in delitos_graves.items():
    print(f"\n{keyword}:")
    total = sum(count for _, count in lista)
    print(f"  Total: {total:,} registros")
    for delito, count in sorted(lista, key=lambda x: x[1], reverse=True)[:5]:
        print(f"    - {delito[:70]:<70} {count:>6,}")


