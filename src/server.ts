import express, { Express } from "express";
import http from "http";
import https from "https";
import { ServerConfig } from "./config";
import { registerErrorHandling, registerMiddlewares } from "./utils";
import { pipe } from "ramda";


export const createServer = <Args extends any[]>(
    config: ServerConfig,
    registerRoutes: (...args: Args) => (app: Express) => Express
) => {
    return {
        start: async (...args: Args) => {
            const expressApp = express();
            const serviceApp = pipe(registerMiddlewares, registerRoutes(...args), registerErrorHandling)(expressApp);
            const { port, secured, hostname } = config;
            const server = secured ? https.createServer(serviceApp) : http.createServer(serviceApp);
            return new Promise<void>((resolve, reject) => {
                server.listen(port, hostname, () => {
                    console.log(`Server is running on port: ${port}`);
                    resolve();
                }).on("error", (error) => {
                    console.log("Error starting the server:", error);
                    reject(error);
                });
            });
        }
    };
};

export type Server = ReturnType<typeof createServer>;
