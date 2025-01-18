import { Router } from "express";
import { signupHandler } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/signup", signupHandler);

export default authRouter;