import { RequestHandler } from "express";
import { CreateEquipmentModel, UpdateEquipmentModel } from "./equipment.model";
import { db } from "../config/db.config";
import { CustomError } from "../config/error.config";

export const createEquipmentHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { name } = req.body as CreateEquipmentModel;
    if (await db.equipment.findUnique({ where: { name } })) {
      throw new CustomError({
        status: "BAD_REQUEST",
        message: "Equipment Already Exists",
      });
    }
    const newEquipment = await db.equipment.create({ data: { name } });
    return res.status(201).json(newEquipment);
  } catch (error) {
    next(error);
  }
};
export const updateEquipmentHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const equipmentId = req.params.equipmentId;
    const { name } = req.body as UpdateEquipmentModel;
    if (!(await db.equipment.findUnique({ where: { name } }))) {
      throw new CustomError({
        status: "NOT_FOUND",
        message: "Equipment Not Found",
      });
    }
    const updatedEquipment = await db.equipment.update({
      where: { id: equipmentId },
      data: { name },
    });
    return res.status(200).json({ message: "Equipment Updated" });
  } catch (error) {
    next(error);
  }
};
export const getAllEquipmentsHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const equipments = await db.equipment.findMany();
    return res.status(200).json(equipments);
  } catch (error) {
    next(error);
  }
};
export const deleteEquipmentHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const equipmentId = req.params.equipmentId;
    await db.equipment.delete({ where: { id: equipmentId } });
    return res.status(200).json({ message: "Equipment Deleted" });
  } catch (error) {
    next(error);
  }
};
