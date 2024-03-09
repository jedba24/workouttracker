import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/env.config";
import { CustomError } from "../config/error.config";

export type TokenType = "ACCESS" | "REFRESH";
export type UserTokenPayload = { id: string; role: "USER" | "ADMIN" };
export const signToken = ({
  type,
  payload,
}: {
  type: TokenType;
  payload: Record<string, string>;
}) => {
  const { expiresIn, secret } =
    jwtConfig[type.toLocaleLowerCase() as keyof typeof jwtConfig];
  return jwt.sign(payload, secret, { expiresIn });
};
export const signUserTokens = (payload: UserTokenPayload) => {
  return {
    accessToken: signToken({ type: "ACCESS", payload }),
    refreshToken: signToken({ type: "REFRESH", payload }),
  };
};

export const verifyToken = async ({
  payload,
  type,
}: {
  type: TokenType;
  payload: string;
}): Promise<UserTokenPayload> => {
  return new Promise((res, rej) => {
    jwt.verify(
      payload,
      jwtConfig[type.toLocaleLowerCase() as keyof typeof jwtConfig].secret,
      (err, decoded) => {
        if (err)
          rej(
            new CustomError({
              status: "NOT_AUTHORIZED",
              message: "Invalid Token",
            })
          );
        res(decoded as UserTokenPayload);
      }
    );
  });
};
