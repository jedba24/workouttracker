import express from "express";
import cors from "cors";
import { PORT } from "./config/env.config";
import { errorMiddleware } from "./middleware/error.middleware";
import { authRouter } from "./auth/auth.routes";
import { db } from "./config/db.config";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.use(errorMiddleware);

const main = async () => {
  await db.$connect();
  app.listen(PORT, () => console.log(`Server Running On: ${PORT}`));
};

main();
