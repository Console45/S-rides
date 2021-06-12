import { UnAuthorizedRequest } from "../utils";
import { authServiceInstance } from "./../services/auth";
import { Response, NextFunction } from "express";

export const auth = async (
  req: any,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authServiceInstance.checkAuth(req.cookies.atk);
    req.user = user;
    next();
  } catch (err) {
    next(new UnAuthorizedRequest("Not authenticated"));
  }
};
