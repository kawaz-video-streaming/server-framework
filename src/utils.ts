import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { RequestErrorHandler } from "./decorators";

export const registerMiddlewares = (corsOrigins: string[]) => (app: Express) => {
    app.use(cors({
        origin: corsOrigins,
        credentials: true
    }));
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    return app;
};

export const registerErrorHandling = (app: Express) => {
    app.use(RequestErrorHandler);
    return app;
}