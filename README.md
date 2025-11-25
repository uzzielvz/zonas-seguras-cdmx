# ZonaSegura CDMX

Interactive web application combining official crime data from Mexico City with real-time citizen reports.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React-Leaflet
- Turf.js

## Installation

```bash
npm install
npm run dev
```

## Features

- Heat map visualization
- Risk buffers (150m radius)
- Citizen reports
- Filters by type, borough, and date

## Project Structure

```
src/
├── components/
│   ├── Map/MapView.tsx
│   ├── Header/Header.tsx
│   └── Sidebar/Sidebar.tsx
├── types/map.ts
└── App.tsx
```

## License

Academic project - Geographic Information Systems
