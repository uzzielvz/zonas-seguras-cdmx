# Presentación LaTeX - ZonaSegura CDMX

## Requisitos

Para compilar la presentación necesitas:

1. **LaTeX Distribution**:
   - Windows: [MiKTeX](https://miktex.org/) o [TeX Live](https://www.tug.org/texlive/)
   - Linux: `sudo apt-get install texlive-full`
   - macOS: [MacTeX](https://www.tug.org/mactex/)

2. **Paquetes necesarios**:
   - beamer (incluido en distribuciones completas)
   - babel-spanish
   - listings
   - graphicx

## Compilación

### Método 1: Desde la línea de comandos

```bash
cd docs
pdflatex presentacion.tex
pdflatex presentacion.tex  # Ejecutar dos veces para referencias
```

### Método 2: Con VS Code

1. Instala la extensión "LaTeX Workshop"
2. Abre `presentacion.tex`
3. Presiona `Ctrl+Alt+B` (o `Cmd+Option+B` en Mac) para compilar

### Método 3: Con un editor LaTeX

- **TeXstudio**: Abre el archivo y presiona F5
- **Overleaf**: Sube el archivo a [overleaf.com](https://www.overleaf.com)

## Estructura de la Presentación

1. **Introducción** - ¿Qué es ZonaSegura CDMX?
2. **Arquitectura** - Stack tecnológico y estructura
3. **Proceso de Desarrollo** - Fases del proyecto
4. **Funcionalidades** - Características principales
5. **Herramientas** - Tecnologías utilizadas
6. **Utilidad** - Casos de uso y funcionamiento
7. **Aspectos Técnicos** - Optimizaciones y detalles
8. **Conclusiones** - Logros y mejoras futuras

## Notas

- El formato es 16:9 (widescreen)
- Tema: Madrid (puedes cambiarlo en la línea 2)
- Idioma: Español
- Si falta algún paquete, LaTeX te pedirá instalarlo automáticamente

## Personalización

Para cambiar el tema, modifica la línea 2:
```latex
\usetheme{Madrid}  % Opciones: Madrid, Berlin, Warsaw, etc.
```

Para cambiar colores:
```latex
\usecolortheme{default}  % Opciones: default, seahorse, whale, etc.
```



