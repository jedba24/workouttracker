import { Router } from "express";
import * as equipmentController from "./equipment.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";
export const equipmentRouter = Router();

/* Admins can create, update or delete equipment. Anyone authenticated can get equipment. */

equipmentRouter
  .post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    equipmentController.createEquipmentHandler
  )
  .put(
    "/:equipmentId",
    authMiddleware,
    roleMiddleware("ADMIN"),
    equipmentController.updateEquipmentHandler
  )
  .get("/", authMiddleware, equipmentController.getAllEquipmentsHandler)
  .delete(
    "/:equipmentId",
    authMiddleware,
    roleMiddleware("ADMIN"),
    equipmentController.deleteEquipmentHandler
  );
