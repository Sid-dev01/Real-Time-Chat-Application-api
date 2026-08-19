# Real-Time Chat App API

A NestJS backend for a real-time chat application built with Fastify, PostgreSQL, and Drizzle ORM. It includes JWT-based authentication, session handling, friendship flows, chat domain logic, validation, security headers, and Swagger documentation in non-production environments.

## Tech Stack

- NestJS 11
- TypeScript
- Fastify 5
- PostgreSQL
- Drizzle ORM
- Docker Compose
- Passport + JWT
- Bcrypt
- Joi environment validation
- Swagger / OpenAPI
- Jest, ESLint, Prettier

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL running locally or via Docker

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root with the required configuration:

```env
NODE_ENV=development
APP_NAME=Real Time Chat App
HOST=0.0.0.0
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/realtime_chat

BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=super-secret-access-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=7d

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=realtime_chat
POSTGRES_PORT=5432
```

Required configuration values:

- `NODE_ENV` must be `development`, `production`, or `test`
- `APP_NAME` is the application name used by the config layer
- `HOST` is the bind host for the Fastify server
- `PORT` is the server port
- `DATABASE_URL` is used by Drizzle for PostgreSQL connectivity
- `BCRYPT_SALT_ROUNDS` sets the bcrypt cost factor
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are used for token signing
- `JWT_ACCESS_EXPIRES_IN` and `JWT_REFRESH_EXPIRES_IN` define token lifetimes

### 3. Start PostgreSQL locally

The project includes a Docker Compose file for local Postgres:

```bash
docker compose -f docker/docker-compose.yml up -d
```

### 4. Run the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run build
npm run start:prod
```

When using the example values above, the API runs at:

```text
http://localhost:3000
```

## Database & Migrations

The app uses Drizzle ORM with PostgreSQL.

- Schema files: `src/db/schema`
- Migration folder: `drizzle/`
- Config: `drizzle.config.ts`

Useful commands:

```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

## API Documentation

Swagger is enabled outside production mode.

```text
http://localhost:3000/docs
```

## Scripts

```bash
npm run build          # Build the NestJS app
npm run start          # Start the app
npm run start:dev      # Start in watch mode
npm run start:debug    # Start with debug mode
npm run start:prod     # Run the built app from dist/main
npm run lint           # Run ESLint with auto-fix
npm run format         # Format source and test files
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests
npm run db:generate    # Generate Drizzle schema snapshots and SQL
npm run db:migrate     # Apply Drizzle migrations
npm run db:push        # Push schema directly to the database
npm run db:studio      # Open Drizzle Studio
```

## Project Structure

```text
src/
  app.module.ts                 # Root Nest module
  main.ts                      # Application entry point
  bootstrap/                   # Validation, filters, security, Swagger setup
  common/                      # Shared decorators, guards, interfaces, helpers
  config/                      # App and auth config + env validation
  db/
    client.ts                  # Database client setup
    drizzle.module.ts          # Drizzle module
    drizzle.service.ts         # Database service
    schema/                    # Drizzle schema definitions
  modules/
    auth/                      # Auth, JWT, sessions
    chat/                      # Chat logic and controllers
    friendship/                # Friendship requests and relationships
    users/                     # User management and profiles
  types/                       # Fastify type augmentations

docker/
  docker-compose.yml           # Local PostgreSQL container setup

drizzle/
  ...                          # Generated migrations and metadata

test/
  app.e2e-spec.ts              # End-to-end test setup
```

## License

This project is currently marked as `UNLICENSED` in `package.json`.
