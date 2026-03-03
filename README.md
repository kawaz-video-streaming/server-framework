# server-framework

TypeScript server framework utilities for building Express-based APIs with consistent middleware, error handling, and request logging.

## Installation

```bash
npm i @ido_kawaz/server-framework
```

## Exports

- `createServer`
- `createServerConfig`
- `ServerConfig`
- `createRequestHandlerDecorator`
- `default` (`multer`)
- `RequestFile`
- Error classes:
	- `ApiError`
	- `BadRequestError`
	- `UnauthorizedError`
	- `NotFoundError`
	- `InternalServerError`
- Express types re-exported:
	- `Application`
	- `Router`
	- `Request`
	- `Response`
	- `NextFunction`

## Environment Variables

- `PORT` (required): server port number.
- `SECURED` (optional): internal secured flag in config (defaults to `false` when not set).

## Quick Start

```ts
import express from "express";
import {
	createRequestHandlerDecorator,
	createServerConfig,
	createServer,
	BadRequestError,
	Request,
	Response
} from "@ido_kawaz/server-framework";

const decorate = createRequestHandlerDecorator("orders-service");

const registerRoutes = () => (app: express.Express) => {
	app.get(
		"/health",
		decorate("health", async (_req: Request, res: Response) => {
			res.status(200).json({ ok: true });
		})
	);

	app.get(
		"/orders/:id",
		decorate("getOrder", async (req: Request, res: Response) => {
			if (!req.params.id) {
				throw new BadRequestError("Missing order id");
			}

			res.status(200).json({ id: req.params.id });
		})
	);

	return app;
};
const config = createServerConfig();
const server = await createServer(config, registerRoutes);
await server.start();
```

## Development Scripts

- `npm run build` - Compile TypeScript to `dist`.
- `npm run build:watch` - Compile in watch mode.
- `npm run build:advanced` - Remove `dist`, `node_modules`, and `package-lock.json`, reinstall, then compile.
- `npm run clean` - Remove `dist`.
- `npm run clean:advanced` - Remove `dist`, `node_modules`, and `package-lock.json`.
- `npm test` - Build and run Jest test suite.
- `npm run test:advanced` - Clean install, build, and run tests.
- `npm run package` - Run advanced tests and publish.

## Testing

Current test coverage includes:

- Server config parsing behavior.
- API error classes and status-code mapping.
- Request handler decorator success/error behavior.
- Centralized request error handler responses.
- Server startup behavior (`http` vs `https`) and startup error propagation.
- Public export surface validation.
