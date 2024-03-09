import { Router } from "express";
import * as muscleController from "./muscle.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";
export const muscleRouter = Router();

/* Admins can create, update or delete muscles. Anyone authenticated can get muscles. */

muscleRouter
  .post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    muscleController.createMuscleHandler
  )
  .put(
    "/:muscleId",
    authMiddleware,
    roleMiddleware("ADMIN"),
    muscleController.updateMuscleHandler
  )
  .get("/", authMiddleware, muscleController.getAllMusclesHandler)
  .delete(
    "/:muscleId",
    authMiddleware,
    roleMiddleware("ADMIN"),
    muscleController.deleteMuscleHandler
  );
