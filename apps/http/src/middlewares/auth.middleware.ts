import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { ACCESS_TOKEN_SECRET } from "../constants/env";
import prisma from "@repo/db/client";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        username: string;
        email: string;
    }
}


export const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            throw new AppError(
                "Access token is missing",
                401,
            )
        }

        const decodeUser = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

        if (!decodeUser || !decodeUser.userId) {
            throw new AppError(
                "Invalid access token.",
                401
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: decodeUser.userId },
            select: {
                id: true,
                username: true,
                email: true,
            }

        });


        if (!user) {
            throw new AppError(
                "User not found",
                404
            )
        }

        req.user = user;
        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(
                new AppError(
                    "Invalid or expired access token",
                    401
                )
            )
        }
        next(error);
    }
}