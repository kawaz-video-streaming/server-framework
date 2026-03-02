import { StatusCodes } from "http-status-codes";
import {
    ApiError,
    BadRequestError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError
} from "../errors";

describe("errors", () => {
    it("creates ApiError with explicit status code", () => {
        const error = new ApiError(418, "teapot");

        expect(error).toBeInstanceOf(Error);
        expect(error.statusCode).toBe(418);
        expect(error.message).toBe("teapot");
    });

    it("creates BadRequestError with BAD_REQUEST status", () => {
        const error = new BadRequestError("bad request");

        expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(error.message).toBe("bad request");
    });

    it("creates UnauthorizedError with UNAUTHORIZED status", () => {
        const error = new UnauthorizedError("unauthorized");

        expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(error.message).toBe("unauthorized");
    });

    it("creates NotFoundError with NOT_FOUND status", () => {
        const error = new NotFoundError("not found");

        expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(error.message).toBe("not found");
    });

    it("creates InternalServerError with INTERNAL_SERVER_ERROR status", () => {
        const error = new InternalServerError("internal");

        expect(error.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(error.message).toBe("internal");
    });
});
