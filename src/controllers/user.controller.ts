import { userServiceInstance } from "./../services/user";
import { NextFunction, Response } from "express";
import { auth } from "../middlewares/auth";
import { ValidationFields } from "../constants/constant";
import { editPasswordSchema } from "./../validators/schema/user";
import { controller, get, patch, use, validate } from "../decorators";
@controller("/users")
class UserController {
  @get("/me")
  @use(auth)
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
  async handleEditPassword(req: any, res: Response, next: NextFunction) {
    try {
      const user = await userServiceInstance.editPassword(
        req.user._id,
        req.body
      );
      res.json({
        status: "success",
        message: `Password update is successful`,
        data: { update: { error: false, user } },
      });
    } catch (err) {
      next(err);
    }
  }

  @get("/me/tickets")
  @use(auth)
  async handleGetUsersTickets(req: any, res: Response, next: NextFunction) {
    try {
      await userServiceInstance.getUserTickets(req.user);
      res.json({
        status: "success",
        data: {
          tickets: req.user.tickets,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
