import z from "zod";
import { RequestHandler } from "express";

export const valMiddleware: (
  schema: z.AnyZodObject | z.ZodEffects<z.AnyZodObject>
) => RequestHandler = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Check Your Input", issues: error.issues });
    }
    next(error);
  }
};
