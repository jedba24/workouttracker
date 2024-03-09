import { RequestHandler } from "express";
import { CustomError } from "../config/error.config";
import { verifyToken } from "../auth/auth.utils";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers["Authorization"];
    if (!header) {
      throw new CustomError({
        status: "NOT_AUTHORIZED",
        message: "No Authorization Header Provided",
      });
    }
    // split on bearer and verify token
    const token = (header as string).split(" ")[1];
    const decoded = await verifyToken({ type: "ACCESS", payload: token });
    // save to request object for use in handlers
    (req as any).user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    next(error);
  }
};

export const roleMiddleware: (role: "ADMIN" | "USER") => RequestHandler =
  (role) => async (req, res, next) => {
    try {
      const { role: userRole } = (req as any).user;
      if (role !== userRole)
        throw new CustomError({
          status: "NOT_AUTHORIZED",
          message: "Not Authorized",
        });
      next();
    } catch (error) {
      next(error);
    }
  };
