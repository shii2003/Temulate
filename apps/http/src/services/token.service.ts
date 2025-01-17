import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants/env";

export const generateAccessToken = (userId: number) => {
    return jwt.sign(
        { userId },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "7d" }
    )
}