import { RequestHandler } from "express";
import { CreateMuscleModel, UpdateMuscleModel } from "./muscle.model";
import { db } from "../config/db.config";
import { CustomError } from "../config/error.config";

export const createMuscleHandler: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body as CreateMuscleModel;
    if (await db.muscle.findUnique({ where: { name } })) {
      throw new CustomError({
        status: "BAD_REQUEST",
        message: "Muscle Already Exists",
      });
    }
    const newMuscle = await db.muscle.create({ data: { name } });
    return res.status(201).json(newMuscle);
  } catch (error) {
    next(error);
  }
};
export const updateMuscleHandler: RequestHandler = async (req, res, next) => {
  try {
    const muscleId = req.params.muscleId;
    const { name } = req.body as UpdateMuscleModel;
    if (!(await db.muscle.findUnique({ where: { name } }))) {
      throw new CustomError({
        status: "NOT_FOUND",
        message: "Muscle Not Found",
      });
    }
    const updatedMuscle = await db.muscle.update({
      where: { id: muscleId },
      data: { name },
    });
    return res.status(200).json({ message: "Muscle Updated" });
  } catch (error) {
    next(error);
  }
};
export const getAllMusclesHandler: RequestHandler = async (req, res, next) => {
  try {
    const muscles = await db.muscle.findMany();
    return res.status(200).json(muscles);
  } catch (error) {
    next(error);
  }
};
export const deleteMuscleHandler: RequestHandler = async (req, res, next) => {
  try {
    const muscleId = req.params.muscleId;
    await db.muscle.delete({ where: { id: muscleId } });
    return res.status(200).json({ message: "Muscle Deleted" });
  } catch (error) {
    next(error);
  }
};
