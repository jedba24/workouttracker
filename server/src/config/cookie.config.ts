import { NODE_ENV } from "./env.config";

export const cookieConfig = {
  httpOnly: true,
  secure: NODE_ENV !== "development",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days expiration in milliseconds
};
