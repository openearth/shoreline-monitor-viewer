# Shoreline Monitor Application

A web-based interactive mapping application for monitoring and visualizing shoreline data.

## Tech Stack

- **Frontend Framework**: Vue 3 with Vite
- **UI Framework**: Vuetify 3
- **State Management**: Pinia

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Mapbox access token

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Mapbox token:
```bash
VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint and auto-fix issues

### Configuration

Map layers are configured in `src/data/layers-config.json`.
