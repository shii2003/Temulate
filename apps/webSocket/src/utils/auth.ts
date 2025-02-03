import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config";

export async function authenticateToken(token: string) {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}
