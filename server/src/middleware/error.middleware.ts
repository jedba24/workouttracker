import { ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err?.statusCode ?? 500,
    message = err?.message ?? "Internal Error";
  return res.status(statusCode).json({ message });
};
