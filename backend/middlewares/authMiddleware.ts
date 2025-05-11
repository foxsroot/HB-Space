import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Redis from "ioredis";
import { ApiError } from "../utils/ApiError";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}

const redis = new Redis(); 

export interface AuthPayload {
    userId: string;
    username: string;
    email: string;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return next(new ApiError(401, "Access token missing"));
    }

    redis.get(`blacklist:${token}`, (err, result) => {
        if (err) {
            return next(new ApiError(500, "Redis error"));
        }

        if (result) {
            return next(new ApiError(403, "Token is blacklisted"));
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
            req.user = decoded;
            next();
        } catch (err) {
            return next(new ApiError(403, "Invalid or expired token"));
        }
    });
}
