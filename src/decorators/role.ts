import { RouteHandlerDescriptor } from "./routes";
import { MetadataKeys } from "../constants/constant";
import { Response, NextFunction } from "express";
import { UnAuthorizedRequest } from "../utils";

export function allow(...roles: string[]) {
  return function (target: Object, key: string, _: RouteHandlerDescriptor) {
    Reflect.defineMetadata(MetadataKeys.ROLE, roles, target, key);
  };
}

export const checkRole = (roles: string[]) => {
  return function (req: any, _: Response, next: NextFunction) {
    if (roles.length === 0) return next();
    !roles.includes(req.user.role)
      ? next(new UnAuthorizedRequest("Not Authorized"))
      : next();
  };
};
