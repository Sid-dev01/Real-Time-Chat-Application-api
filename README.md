# Real-Time Chat App Backend

A NestJS backend for a real-time chat application. The project currently uses the Fastify platform adapter, centralized configuration validation, Helmet security headers, Swagger API docs in non-production environments, and Prisma configured for PostgreSQL.

## Tech Stack

- NestJS 11
- TypeScript
- Fastify
- Prisma
- PostgreSQL
- Swagger / OpenAPI
- Jest
- ESLint + Prettier

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Create a `.env` file in the project root:

```env
NODE_ENV=development
APP_NAME=Real Time Chat App
HOST=0.0.0.0
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME
```

Required app configuration:

- `NODE_ENV` must be `development`, `production`, or `test`
- `APP_NAME` is the application name
- `HOST` is the server host
- `PORT` is the server port
- `DATABASE_URL` is used by Prisma for PostgreSQL

### 3. Run the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run build
npm run start:prod
```

When running locally with the example values above, the API will be available at:

```text
http://localhost:3000
```

## API Documentation

Swagger is enabled outside production.

```text
http://localhost:3000/docs
```

## Prisma

The Prisma schema lives in:

```text
prisma/schema.prisma
```

Prisma reads `DATABASE_URL` from `.env` via `prisma.config.ts`.

Useful commands:

```bash
npx prisma generate
npx prisma migrate dev
```

## Scripts

```bash
npm run build       # Build the app
npm run start       # Start the app
npm run start:dev   # Start in watch mode
npm run start:prod  # Run built app from dist/main
npm run lint        # Run ESLint with auto-fix
npm run format      # Format source and test files
npm run test        # Run unit tests
npm run test:e2e    # Run e2e tests
npm run test:cov    # Run tests with coverage
```

## Project Structure

```text
src/
  bootstrap/    # App bootstrap helpers: validation, filters, security, Swagger
  common/       # Shared filters and reusable common code
  config/       # App configuration and environment validation
  app.module.ts # Root Nest module
  main.ts       # Application entry point

prisma/
  schema.prisma # Prisma database schema

test/           # End-to-end tests
```

## License

This project is currently marked as `UNLICENSED` in `package.json`.
