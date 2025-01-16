import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError"

export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void | Response => {
    if (error instanceof AppError) {
        return res
            .status(error.statusCode)
            .json({ message: error.message });
    }

    if (error instanceof Error) {
        res
            .status(500)
            .json({ error: error.message });
    } else {
        res
            .status(500)
            .json({ message: "Something went wrong" });
    }

}