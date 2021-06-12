import { ValidationFields } from "./../constants/constant";
import { Response, NextFunction } from "express";
import { controller, post, use, validate } from "../decorators";
import { authServiceInstance } from "../services/auth";
import { auth } from "../middlewares/auth";
import { registerSchema, loginSchema } from "../validators/schema";

@controller("/auth")
class AuthController {
  @post("/register")
  @validate({ schema: registerSchema, field: ValidationFields.BODY })
  async handleRegister(req: any, res: Response, next: NextFunction) {
    try {
      const user = await authServiceInstance.registerUser(req.body);
      res.status(201).json({
        status: "success",
        message: `${user.role} registration is successful`,
        data: {
          user,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  @post("/login")
  @validate({ schema: loginSchema, field: ValidationFields.BODY })
  async handleLogin(req: any, res: Response, next: NextFunction) {
    try {
      const user = await authServiceInstance.loginUser(req.body);
      res.json({
        status: "success",
        message: `${user.role} login is successful`,
        data: {
          user,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  @post("/refresh_token")
  async handleRefreshToken(req: any, res: Response, next: NextFunction) {
    try {
      await authServiceInstance.refreshToken(req.cookies.jid);
      res.json({
        status: "success",
        message: "Access token refresh is successful",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

  @post("/logout")
  @use(auth)
  async handleLogout(_: any, res: Response, next: NextFunction) {
    try {
      authServiceInstance.logoutUser();
      res.json({
        status: "success",
        message: `Logout is successful`,
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
}
