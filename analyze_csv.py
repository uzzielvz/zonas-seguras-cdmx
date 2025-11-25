import csv

# Leer las primeras filas del CSV
with open('data/da_carpetas-de-investigacion-pgj-cdmx (1).csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    
    # Leer primeras 5 filas
    rows = []
    for i, row in enumerate(reader):
        if i >= 5:
            break
        rows.append(row)
    
    # Mostrar estructura
    print("=" * 80)
    print("COLUMNAS DISPONIBLES:")
    print("=" * 80)
    if rows:
        for col in rows[0].keys():
            print(f"  - {col}")
    
    print("\n" + "=" * 80)
    print("EJEMPLO DE DATOS (Primeras 3 filas):")
    print("=" * 80)
    for i, row in enumerate(rows[:3], 1):
        print(f"\n--- Fila {i} ---")
        print(f"Fecha: {row.get('FechaHecho', 'N/A')}")
        print(f"Delito: {row.get('delito', 'N/A')}")
        print(f"Categoría: {row.get('categoria_delito', 'N/A')}")
        print(f"Alcaldía: {row.get('AlcaldiaHechos', 'N/A')}")
        print(f"Colonia: {row.get('colonia_datos', 'N/A')}")
        print(f"Longitud: {row.get('longitud', 'N/A')}")
        print(f"Latitud: {row.get('latitud', 'N/A')}")
    
    # Contar total de filas (aproximado)
    print("\n" + "=" * 80)
    print("CONTANDO TOTAL DE REGISTROS...")
    print("=" * 80)
    f.seek(0)
    next(reader)  # Saltar header
    count = sum(1 for _ in reader)
    print(f"Total de registros: {count:,}")


