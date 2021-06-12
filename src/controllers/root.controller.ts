import { Request, Response } from "express";
import { controller, get } from "../decorators";

@controller("")
class RootController {
  @get("/ping")
  handlePing(_: Request, res: Response) {
    res.json({
      message: "health check is successful",
      status: "success",
      data: null,
    });
  }
}
