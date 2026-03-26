import { createServerConfig } from "../config";
import { ZodError } from "zod";

describe("createServerConfig", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("parses PORT from environment variables", () => {
        process.env.PORT = "3000";
        delete process.env.SECURED;

        const config = createServerConfig();

        expect(config).toEqual({ port: 3000, secured: false, hostname: "0.0.0.0" });
    });

    it("coerces SECURED string value to boolean", () => {
        process.env.PORT = "3000";
        process.env.SECURED = "true";

        const config = createServerConfig();

        expect(config).toEqual({ port: 3000, secured: true, hostname: "0.0.0.0" });
    });

    it("throws when PORT is missing", () => {
        delete process.env.PORT;
        delete process.env.SECURED;

        const expectedError = new ZodError([
            {
                code: "invalid_type",
                expected: "number",
                received: "nan",
                path: ["PORT"],
                message: "Expected number, received nan"
            }
        ]);

        try {
            createServerConfig();
            throw new Error("Expected createServerConfig to throw");
        } catch (error) {
            expect(error).toBeInstanceOf(ZodError);
            expect(error).toEqual(expectedError);
        }
    });

    it("throws when PORT is invalid", () => {
        process.env.PORT = "not-a-number";
        delete process.env.SECURED;

        const expectedError = new ZodError([
            {
                code: "invalid_type",
                expected: "number",
                received: "nan",
                path: ["PORT"],
                message: "Expected number, received nan"
            }
        ]);

        try {
            createServerConfig();
            throw new Error("Expected createServerConfig to throw");
        } catch (error) {
            expect(error).toBeInstanceOf(ZodError);
            expect(error).toEqual(expectedError);
        }
    });
});
