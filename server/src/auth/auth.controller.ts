import { RequestHandler } from "express";
import { db } from "../config/db.config";
import { CustomError } from "../config/error.config";
import argon from "argon2";
import { LoginUserModel, RegisterUserModel } from "./auth.model";
import { signUserTokens, verifyToken } from "./auth.utils";
import { NODE_ENV } from "../config/env.config";

export const registerUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { confirmPassword, password, ...rest } =
      req.body as RegisterUserModel;
    const foundUser = await db.user.findUnique({
      where: { email: rest.email },
    });
    if (foundUser)
      throw new CustomError({
        status: "BAD_REQUEST",
        message: "User Already Exists",
      });
    const hashedPassword = await argon.hash(password);
    const newUser = await db.user.create({
      data: { ...rest, passwordHash: hashedPassword },
    });
    const {
      passwordHash,
      refreshToken: storedToken,
      ...restOfNewUser
    } = newUser;
    const { accessToken, refreshToken } = signUserTokens({
      id: restOfNewUser.id,
      role: restOfNewUser.role,
    });
    await db.user.update({
      where: { id: restOfNewUser.id },
      data: { refreshToken },
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days expiration in milliseconds
    });
    res.status(201).json({
      user: restOfNewUser,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as LoginUserModel;
    const foundUser = await db.user.findUnique({
      where: { email: email },
    });
    if (
      !foundUser ||
      (foundUser && !(await argon.verify(foundUser.passwordHash, password)))
    )
      throw new CustomError({
        status: "NOT_AUTHORIZED",
        message: "Email or Password Incorrect",
      });

    const {
      passwordHash,
      refreshToken: storedToken,
      ...restOfUser
    } = foundUser;
    const { accessToken, refreshToken } = signUserTokens({
      id: restOfUser.id,
      role: restOfUser.role,
    });
    await db.user.update({
      where: { id: restOfUser.id },
      data: { refreshToken, lastLoginAt: new Date().toISOString() },
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days expiration in milliseconds
    });
    res.status(201).json({
      user: restOfUser,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      throw new CustomError({
        status: "NOT_AUTHORIZED",
        message: "No Token Provided",
      });
    const { id, role } = await verifyToken({
      payload: refreshToken,
      type: "REFRESH",
    });
    const foundUser = await db.user.findUnique({
      where: { id },
    });
    if (!foundUser)
      throw new CustomError({
        status: "NOT_AUTHORIZED",
        message: "Invalid Token",
      });
    const { accessToken } = signUserTokens({
      id: foundUser.id,
      role: foundUser.role,
    });
    const {
      passwordHash,
      refreshToken: storedToken,
      ...restOfUser
    } = foundUser;
    res.status(201).json({
      user: restOfUser,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logOffHandler: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(200).json({ message: "Signed Out" });
    const { id } = await verifyToken({
      payload: refreshToken,
      type: "REFRESH",
    });
    const foundUser = await db.user.findUnique({
      where: { id },
    });
    if (!foundUser) {
      res.clearCookie("refreshToken", { expires: new Date(0) });
      return res.status(200).json({ message: "Signed Out" });
    }
    await db.user.update({ where: { id }, data: { refreshToken: null } });
    res.clearCookie("refreshToken", { expires: new Date(0) });
    return res.status(200).json({ message: "Signed Out" });
  } catch (error) {
    next(error);
  }
};
