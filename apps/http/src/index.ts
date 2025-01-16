import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { APP_ORIGIN, PORT } from "./constants/env";

import authRoutes from "./routes/auth.route";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import prisma from "@repo/db/client";

const app = express();

app.use(cors({
    origin: APP_ORIGIN,
    credentials: true,
}))

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));
app.use(cookieParser());

app.use("api/v1/auth", authRoutes);

app.use((err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    errorHandler(err, req, res, next);
});

app.get('/', (req, res) => {
    res.status(200).json({
        status: "healthy",
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} in developmet env`);
})