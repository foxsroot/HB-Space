import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction) {
    const status = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    res.status(status).json({ error: message });
}
