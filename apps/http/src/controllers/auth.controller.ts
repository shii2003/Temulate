import { NextFunction, Request, Response } from "express";
import { createUser, loginUser } from "../services/auth.service";
import { sendApiRespnose } from "../utils/apiResponse";
import { NODE_ENV } from "../constants/env";

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

// const logoutHandler = async()

// export const signupHandlerTest = async (req: Request, res: Response) => {
//     const { username, email, password } = req.body;

//     try {
//         const user = await prisma.user.create({
//             data: {
//                 username,
//                 email,
//                 password,
//             },
//             select: {
//                 id: true,
//                 username: true,
//                 email: true,
//             }
//         })
//         if (!user) {
//             res.status(400).json({ message: "failed to create user." });
//         }

//         res.status(200).json({ user, message: "user created succefully." });


//     } catch (error) {
//         console.log("Error in /signup route", error);
//         res.status(500).json({ message: "Internal Server Error" })
//     }
// }