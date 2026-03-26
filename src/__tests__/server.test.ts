import express from "express";
import http from "http";
import https from "https";
import { createServer } from "../server";
import { Express } from "express";

const registerMiddlewaresMock = jest.fn((app) => app);
const registerErrorHandlingMock = jest.fn((app) => app);

jest.mock("../utils", () => ({
    registerMiddlewares: (app: unknown) => registerMiddlewaresMock(app),
    registerErrorHandling: (app: unknown) => registerErrorHandlingMock(app)
}));

jest.mock("ramda", () => ({
    pipe: (...functions: Array<(input: unknown) => unknown>) =>
        (input: unknown) => functions.reduce((value, fn) => fn(value), input)
}));

jest.mock("express", () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock("http", () => ({
    __esModule: true,
    default: {
        createServer: jest.fn()
    }
}));

jest.mock("https", () => ({
    __esModule: true,
    default: {
        createServer: jest.fn()
    }
}));

describe("createServer", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("uses HTTP server when secured is false", async () => {
        const expressApp = { name: "express-app" };
        const serviceApp = { name: "service-app" };
        const onMock = jest.fn();
        const listenMock = jest.fn((_: number, __: string, callback: () => void) => {
            callback();
            return { on: onMock };
        });

        const expressMock = express as unknown as jest.Mock;
        expressMock.mockReturnValue(expressApp);
        (http.createServer as jest.Mock).mockReturnValue({ listen: listenMock });

        const routeHandler = jest.fn(() => serviceApp as unknown as Express);
        const registerRoutes = jest.fn(() => routeHandler);
        const server = await createServer({ port: 3000, secured: false, hostname: "0.0.0.0" }, registerRoutes as unknown as () => (app: Express) => Express);

        await expect(server.start()).resolves.toBeUndefined();

        expect(registerMiddlewaresMock).toHaveBeenCalledWith(expressApp);
        expect(registerErrorHandlingMock).toHaveBeenCalledWith(serviceApp);
        expect(http.createServer).toHaveBeenCalledWith(serviceApp);
        expect(https.createServer).not.toHaveBeenCalled();
        expect(listenMock).toHaveBeenCalledWith(3000, "0.0.0.0", expect.any(Function));
        expect(onMock).toHaveBeenCalledWith("error", expect.any(Function));
    });

    it("uses HTTPS server when secured is true", async () => {
        const expressApp = { name: "express-app" };
        const onMock = jest.fn();
        const listenMock = jest.fn((_: number, __: string, callback: () => void) => {
            callback();
            return { on: onMock };
        });

        const expressMock = express as unknown as jest.Mock;
        expressMock.mockReturnValue(expressApp);
        (https.createServer as jest.Mock).mockReturnValue({ listen: listenMock });

        const registerRoutes = () => (app: Express) => app;
        const server = createServer({ port: 3443, secured: true, hostname: "0.0.0.0" }, registerRoutes);

        await expect(server.start()).resolves.toBeUndefined();

        expect(https.createServer).toHaveBeenCalledTimes(1);
        expect(http.createServer).not.toHaveBeenCalled();
    });

    it("rejects when underlying server emits error", async () => {
        const expressApp = { name: "express-app" };
        const startupError = new Error("listen failed");
        const onMock = jest.fn((event: string, handler: (error: Error) => void) => {
            if (event === "error") {
                handler(startupError);
            }
            return undefined;
        });
        const listenMock = jest.fn(() => ({ on: onMock }));

        const expressMock = express as unknown as jest.Mock;
        expressMock.mockReturnValue(expressApp);
        (http.createServer as jest.Mock).mockReturnValue({ listen: listenMock });

        const registerRoutes = () => (app: Express) => app;
        const server = await createServer({ port: 3001, secured: false, hostname: "0.0.0.0" }, registerRoutes);

        await expect(server.start()).rejects.toThrow("listen failed");
    });
});