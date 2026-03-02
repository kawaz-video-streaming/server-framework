import cors from "cors";
import bodyParser from "body-parser";
import express, { Express } from "express";
import { RequestErrorHandler } from "./decorators";

export const registerMiddlewares = (app: Express) => {
    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    return app;
};

export const registerErrorHandling = (app: Express) => {
    app.use(RequestErrorHandler);
    return app;
}