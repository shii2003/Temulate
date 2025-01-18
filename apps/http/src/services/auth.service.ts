import { loginSchema, signupSchema, signupSchemaTest } from "../types/responseTypes"
import prisma from "@repo/db/client";
import { AppError } from "../utils/AppError";
import { comparePasswords, hashPassword } from "../utils/hashPassword";
import { generateAccessToken } from "./token.service";
import { ZodError } from "zod";


export const createUser = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
) => {
    try {
        const validatedData = signupSchema.parse({ username, email, password, confirmPassword });

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
        console.log("Error in signup service:", error);
        throw new AppError(
            "An unexpected error occured.",
            500
        );
    }

}

export const loginUser = async (email: string, password: string) => {
    try {
        const validatedData = loginSchema.parse({ email, password });

        const user = await prisma.user.findFirst({
            where:
            {
                email: validatedData.email,
            },
            select: {
                id: true,
                username: true,
                email: true,
                password: true,
            }
        });

        if (!user) {
            throw new AppError(
                "email does not exist.",
                400
            )
        }

        const isPasswordValid = comparePasswords(validatedData.password, user.password);

        if (!isPasswordValid) {
            throw new AppError(
                "password is not correct",
                401
            )
        }
        const accessToken = generateAccessToken(user.id);

        const { password: _, ...safeUser } = user;

        return {
            user: safeUser,
            accessToken
        }

    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.errors.map((err) => err.message).join(", ");
            throw new AppError(
                errorMessages,
                400
            )
        }
        if (error instanceof AppError) {
            throw error;
        }
        console.log("An error occured in the loginUser service: ", error);
        throw new AppError(
            "An Error occured.",
            500
        )
    }
}