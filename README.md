# Real-Time Task Management System

A full-stack real-time task management application where users can create tasks, assign them to others, and receive real-time notifications when tasks are completed.

## Features

- Real-time task updates using WebSockets
- User authentication and authorization
- Task creation, assignment, and management
- Real-time notifications
- Responsive UI with Vuetify 3
- RESTful API with NestJS

## Tech Stack

### Frontend
- Vue 3 with Composition API
- TypeScript
- Pinia for state management
- Vue Router
- Vuetify 3 (Material Design)
- Socket.io-client for real-time communication
- Axios for HTTP requests

### Backend
- NestJS with TypeScript
- PostgreSQL via Supabase
- TypeORM for database interactions
- Socket.io for real-time communication
- JWT-based authentication
- Swagger/OpenAPI for API documentation

## Project Structure

```
/
├── backend/           # NestJS backend
│   ├── src/
│   │   ├── modules/   # Feature modules
│   │   │   ├── auth/  # Authentication
│   │   │   ├── tasks/ # Task management
│   │   │   ├── users/ # User management
│   │   │   └── events/ # WebSocket events
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── ...
├── src/               # Vue frontend
│   ├── components/    # Vue components
│   ├── views/         # Vue views/pages
│   ├── store/         # Pinia stores
│   ├── router/        # Vue Router
│   ├── services/      # API services
│   ├── socket/        # WebSocket setup
│   └── ...
└── ...
```

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or pnpm
- PostgreSQL database or Supabase account

### Setup

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Configure environment variables:

```bash
# Frontend
cp .env.example .env.local

# Backend
cd backend
cp .env.example .env
```

4. Start the development servers:

```bash
# Start backend server
cd backend
npm run start:dev

# Start frontend server (in another terminal)
npm run dev
```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api/docs

## Deployment

### Frontend
The frontend can be deployed to Vercel or Netlify:

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` directory to your hosting provider.

### Backend
The backend can be deployed to Render:

1. Push your code to a Git repository
2. Connect your repository to Render
3. Configure the environment variables
4. Deploy the service

## License

This project is licensed under the MIT License.
