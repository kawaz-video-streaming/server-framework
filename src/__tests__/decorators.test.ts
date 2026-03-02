import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";
import { createRequestHandlerDecorator, RequestErrorHandler } from "../decorators";
import { BadRequestError } from "../errors";

const infoMock = jest.fn();
const errorMock = jest.fn();

jest.mock("pino", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        info: infoMock,
        error: errorMock
    }))
}));

describe("createRequestHandlerDecorator", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("logs start and success for successful handlers", async () => {
        const serviceName = "orders-service";
        const functionName = "getOrders";
        const baseHandler = jest.fn().mockResolvedValue(undefined);
        const decoratedHandler = createRequestHandlerDecorator(serviceName)(functionName, baseHandler);

        const request = { method: "GET" } as Request;
        const response = {} as Response;
        const next = jest.fn() as NextFunction;

        await decoratedHandler(request, response, next);

        expect(pino).toHaveBeenCalledWith({ name: serviceName });
        expect(baseHandler).toHaveBeenCalledWith(request, response, next);
        expect(infoMock).toHaveBeenCalledTimes(2);
        expect(errorMock).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it("logs error and forwards exception for failing handlers", async () => {
        const functionName = "createOrder";
        const failure = new Error("boom");
        const baseHandler = jest.fn().mockRejectedValue(failure);
        const decoratedHandler = createRequestHandlerDecorator("orders-service")(functionName, baseHandler);

        const request = { method: "POST" } as Request;
        const response = {} as Response;
        const next = jest.fn() as NextFunction;

        await decoratedHandler(request, response, next);

        expect(baseHandler).toHaveBeenCalledWith(request, response, next);
        expect(errorMock).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(failure);
    });
});

describe("RequestErrorHandler", () => {
    it("responds with ApiError status code", () => {
        const error = new BadRequestError("invalid payload");
        const statusMock = jest.fn();
        const jsonMock = jest.fn();

        statusMock.mockReturnValue({ json: jsonMock });

        const request = {} as Request;
        const response = { status: statusMock } as unknown as Response;
        const next = jest.fn() as NextFunction;

        RequestErrorHandler(error, request, response, next);

        expect(statusMock).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(jsonMock).toHaveBeenCalledWith({ error: "invalid payload" });
    });

    it("responds with 500 for unknown errors", () => {
        const error = new Error("unexpected");
        const statusMock = jest.fn();
        const jsonMock = jest.fn();

        statusMock.mockReturnValue({ json: jsonMock });

        const request = {} as Request;
        const response = { status: statusMock } as unknown as Response;
        const next = jest.fn() as NextFunction;

        RequestErrorHandler(error, request, response, next);

        expect(statusMock).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(jsonMock).toHaveBeenCalledWith({ error: "unexpected" });
    });
});
