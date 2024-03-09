import { Router } from "express";
import * as authController from "./auth.controller";
import { valMiddleware } from "../middleware/val.middleware";
import { loginUserModel, registerUserModel } from "./auth.model";

export const authRouter = Router();

authRouter
  .post(
    "/register",
    valMiddleware(registerUserModel),
    authController.registerUserHandler
  )
  .post(
    "/login",
    valMiddleware(loginUserModel),
    authController.loginUserHandler
  )
  .get("/logout", authController.logOffHandler)
  .get("/refresh", authController.refreshUserHandler);
