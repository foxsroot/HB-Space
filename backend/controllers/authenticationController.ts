import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { Op } from "sequelize";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import Redis from "ioredis";
import jwt from "jsonwebtoken";

const redis = new Redis();

export async function login(req: Request, res: Response, next: NextFunction) {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return next(new ApiError(400, "Identifier and password are required."));
    }

    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: identifier },
                    { email: identifier }
                ]
            }
        })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new ApiError(401, "Invalid username or password."));
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables.");
        }

        const payload = {
            userId: user.userId,
            username: user.username,
            email: user.email
        }

        const expiresIn = process.env.JWT_EXPIRES_IN || 604800;

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: Number(expiresIn)
        });

        res.status(200).json({
            message: "Login successful",
            token,
            userId: user.userId
        })
    } catch (error) {
        next(new ApiError(500, "Login failed"));
    }
}

export async function register(req: Request, res: Response, next: NextFunction) {
    const {
        username,
        email,
        password,
    } = req.body;

    if (!username || !email || !password) {
        return next(new ApiError(400, "Missing required fields."));
    }

    const existingUser = await User.findOne({
        where: {
            [Op.or]: [
                { username },
                { email }
            ]
        }
    })

    if (existingUser) {
        return next(new ApiError(409, "Username or email already exists."));
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables.");
        }

        const payload = {
            userId: user.userId,
            username: user.username,
            email: user.email
        }

        const expiresIn = process.env.JWT_EXPIRES_IN || 604800;

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: Number(expiresIn)
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                country: user.country,
                birthdate: user.birthdate
            },
            token
        });
    } catch (error) {
        next(new ApiError(500, "Registration failed"));
    }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return next(new ApiError(400, "Token is required for logout"));
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables.");
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { exp: number };
        const expirationTime = decoded.exp;

        await redis.set(`blacklist:${token}`, "true", "EX", expirationTime - Math.floor(Date.now() / 1000));

        res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        next(new ApiError(500, "Logout failed"));
    }
}