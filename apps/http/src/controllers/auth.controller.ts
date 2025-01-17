import { NextFunction, Request, Response } from "express";

export const login = (
    req: Request,
    res: Response,
    next: NextFunction) => {

    const { email, password } = req.body;


}

export const signup = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {

    const { username, email, password, forgotPassword } = req.body;
}