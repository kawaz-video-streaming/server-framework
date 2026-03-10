# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build          # Compile TypeScript to dist/
npm run build:watch    # Watch mode compilation
npm test               # Build then run Jest (--runInBand)
npm run clean          # Remove dist/
npm run package        # Full clean install, build, test, publish
```

Run a single test file:
```bash
npx jest src/__tests__/server.test.ts --runInBand
```

## Architecture

This is a TypeScript library (`@ido_kawaz/server-framework`) published to npm. It wraps Express with opinionated defaults for Kawaz Plus microservices. The entry point is [src/index.ts](src/index.ts) which re-exports the public surface.

**Core flow:**

1. `createServerConfig()` — reads `PORT` (required) and `SECURED` (optional, default `false`) from `process.env` via Zod validation.
2. `createServer(config, registerRoutes)` — returns a `{ start }` object. On `start()`, it:
   - Creates an Express app
   - Pipes: `registerMiddlewares` → `registerRoutes(...args)` → `registerErrorHandling` (using Ramda `pipe`)
   - Starts `http` or `https` server based on `config.secured`
3. `createRequestHandlerDecorator(serviceName)` — curried decorator factory. Returns a `decorate(functionName, handler)` function that wraps each route handler with pino structured logging and passes errors to `next()`.
4. `RequestErrorHandler` — Express 4-arg error middleware that maps `ApiError` subclasses to their status codes, otherwise returns 500.

**Key files:**
- [src/server.ts](src/server.ts) — `createServer`, `Server` type
- [src/config.ts](src/config.ts) — `createServerConfig`, `ServerConfig`, Zod env schema
- [src/decorators.ts](src/decorators.ts) — `createRequestHandlerDecorator`, `RequestErrorHandler`
- [src/utils.ts](src/utils.ts) — `registerMiddlewares`, `registerErrorHandling` (internal)
- [src/errors.ts](src/errors.ts) — `ApiError` base class and subclasses (`BadRequestError`, `UnauthorizedError`, `NotFoundError`, `InternalServerError`)
- [src/types.ts](src/types.ts) — `RequestFile` type

**Error hierarchy:** All errors extend `ApiError` which carries a `statusCode`. The `RequestErrorHandler` checks `instanceof ApiError` to determine response status.

**Middleware (registered automatically by `createServer`):** cors, body-parser JSON, multer — configured in `utils.ts`.

## Publishing

`npm run package` runs `test:advanced` (full clean + reinstall + build + test) then `npm publish --access public`. Bump the version in `package.json` before publishing.
