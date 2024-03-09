import dotenv from "dotenv";
dotenv.config();

export const PORT = parseInt(process.env.PORT || "5000");
export const jwtConfig = {
  access: {
    secret: process.env.JWT_ACCESS_SECRET as string,
    expiresIn: "15m",
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET as string,
    expiresIn: "7d",
  },
};
export const NODE_ENV = process.env.NODE_ENV as "development" | "production";
