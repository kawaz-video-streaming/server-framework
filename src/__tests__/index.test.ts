import multer from "multer";
import {
    createServer,
    createServerConfig,
    createRequestHandlerDecorator,
    ApiError,
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    InternalServerError,
    RequestFile
} from "../index";

describe("index exports", () => {
    it("exports core functions", () => {
        expect(typeof createServer).toBe("function");
        expect(typeof createServerConfig).toBe("function");
        expect(typeof createRequestHandlerDecorator).toBe("function");
    });

    it("re-exports multer as default export", async () => {
        const module = await import("../index");
        expect(module.default).toBe(multer);
    });

    it("exports error classes", () => {
        expect(ApiError).toBeDefined();
        expect(BadRequestError).toBeDefined();
        expect(UnauthorizedError).toBeDefined();
        expect(NotFoundError).toBeDefined();
        expect(InternalServerError).toBeDefined();
    });

    it("exports RequestFile type", () => {
        const typedFile = {
            fieldname: "file",
            originalname: "demo.txt"
        } as RequestFile;

        expect(typedFile.originalname).toBe("demo.txt");
    });
});