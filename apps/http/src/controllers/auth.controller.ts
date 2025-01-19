import { NextFunction, Request, Response } from "express";
import { createUser, loginUser } from "../services/auth.service";
import { sendApiRespnose } from "../utils/apiResponse";
import { NODE_ENV } from "../constants/env";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { AppError } from "../utils/AppError";

export const signupHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {

    try {
        const { username, email, password, confirmPassword } = req.body;
        console.log("request received:", username, email, password, confirmPassword);
        const { newUser, accessToken } = await createUser(
            username,
            email,
            password,
            confirmPassword
        );
        console.log("new user created", newUser);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict'
        });

        sendApiRespnose(res,
            {
                data: newUser,
                statusCode: 201,
                message: "User created successfully"
            }
        );
    } catch (error) {
        next(error);
    }
}

export const loginHandler = async (
    req: Request,
    res: Response,
    next: NextFunction) => {

    try {
        const { email, password } = req.body;
        const { user, accessToken } = await loginUser(email, password);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict'
        });

        sendApiRespnose(res,
            {
                data: user,
                statusCode: 200,
                message: "Logged in successfully."
            }
        )
    } catch (error) {
        next(error);
    }
}

export const logoutHandler = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError(
                "User not logged in.",
                401
            )
        }

        res.clearCookie("accessToken");
        sendApiRespnose(res, {
            statusCode: 200,
            message: "logged out successfully"
        }
        )
    } catch (error) {
        next(error);
    }
}

