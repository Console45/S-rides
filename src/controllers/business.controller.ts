import { controller, get } from "../decorators";
import { NextFunction, Response } from "express";
import { businessServiceInsatance } from "../services/business";

@controller("/business")
class BusinessController {
  @get("/data")
  async handleOrderTicket(_: any, res: Response, next: NextFunction) {
    try {
      const data = await businessServiceInsatance.getBusinessData();
      res.json({
        status: "success",
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}
