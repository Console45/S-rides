import { userServiceInstance } from "./../services/user";
import { NextFunction, Response, Request } from "express";
import { auth } from "../middlewares/auth";
import { ValidationFields, Allow } from "../constants/constant";
import {
  editPasswordSchema,
  editPhoneSchema,
  editProfileSchema,
  getUsersSchema,
} from "./../validators/schema/user";
import {
  allow,
  controller,
  get,
  patch,
  post,
  use,
  validate,
} from "../decorators";
@controller("/users")
class UserController {
  @get("/me")
  @use(auth)
  @allow(Allow.User)
  async handleGetProfile(req: any, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      res.json({
        status: "success",
        message: `${user.role} profile fetched successfully`,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }

  @patch("/me/edit_password")
  @validate({ schema: editPasswordSchema, field: ValidationFields.BODY })
  @use(auth)
  @allow(Allow.User)
  async handleEditPassword(req: any, res: Response, next: NextFunction) {
    try {
      const user = await userServiceInstance.editPassword(
        req.user._id,
        req.body
      );
      res.json({
        status: "success",
        message: `${user.role} password update is successful`,
        data: { update: { error: false, user } },
      });
    } catch (err) {
      next(err);
    }
  }
}
