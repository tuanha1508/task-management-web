# Task Management System

A real-time task management system with Vue 3, TypeScript, Pinia, and Vuetify.

## Project Structure

The project is organized into the following structure:

- `frontend/` - Contains all frontend-related code
  - `src/` - Source code for the Vue application
    - `assets/` - Static assets (images, icons, etc.)
    - `components/` - Vue components
    - `stores/` - Pinia stores for state management
    - `types/` - TypeScript type definitions
    - `views/` - Vue views/pages
  - `public/` - Public static files
  - Configuration files (vite.config.ts, tsconfig.json, etc.)

## Development

To run the development server:

```bash
cd frontend
npm install
npm run dev
```

## Building for Production

To build the frontend for production:

```bash
cd frontend
npm run build
```

The build output will be in the `frontend/dist` directory.
