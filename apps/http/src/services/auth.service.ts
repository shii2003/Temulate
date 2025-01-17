import { signupSchema } from "../types/responseTypes"
import prisma from "@repo/db/client";
import { AppError } from "../utils/AppError";
import { hashPassword } from "../utils/hashPassword";
import { generateAccessToken } from "./token.service";
import { ZodError } from "zod";

export const loginUser = (email: string, password: string) => {

}

export const createUser = async (
    username: string,
    email: string,
    password: string,
    forgotPassword: string
) => {
    try {
        const validatedData = signupSchema.parse({ username, email, password, forgotPassword });

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: validatedData.username },
                    { email: validatedData.email }
                ]
            }
        })
        if (existingUser) {
            if (existingUser.username == validatedData.username) {
                throw new AppError(
                    "username already exists.",
                    400
                );
            }
            if (existingUser.email == validatedData.email) {
                throw new AppError(
                    "email already taken.",
                    400
                );
            }
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true,
                email: true,
            }
        });

        const accessToken = generateAccessToken(newUser.id);

        return {
            newUser,
            accessToken
        }

    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.errors.map((err) => err.message).join(", ");
            throw new AppError(errorMessages, 400);
        } if (error instanceof AppError) {
            throw error
        }
        throw new AppError(
            "An unexpected error occured.",
            500
        );
    }

}