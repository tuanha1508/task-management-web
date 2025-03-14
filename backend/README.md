# Task Management Backend

A real-time task management API built with NestJS, TypeORM, PostgreSQL, and Socket.io.

## Features

- RESTful API for task management
- Real-time updates via WebSockets
- JWT-based authentication
- PostgreSQL database with TypeORM
- Swagger API documentation

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL database (or Supabase account)
- npm or pnpm

## Setup

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

5. Start the development server:

```bash
npm run start:dev
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api/docs
```

## Database Setup

The application uses TypeORM with PostgreSQL. You can either:

1. Use a local PostgreSQL instance
2. Use Supabase (recommended for easy setup)

If using Supabase:
1. Create a new project
2. Get the connection details from the project settings
3. Update the `.env` file with your Supabase credentials

## Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start the application in watch mode
- `npm run start:debug` - Start the application in debug mode
- `npm run start:prod` - Start the application in production mode
- `npm run lint` - Lint the code
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests 