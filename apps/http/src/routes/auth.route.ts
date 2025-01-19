import { Router } from "express";
import { loginHandler, logoutHandler, signupHandler } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", signupHandler);
authRouter.post("/login", loginHandler);

authRouter.post("/logout", authenticate, logoutHandler);

export default authRouter;