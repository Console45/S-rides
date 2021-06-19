import { auth } from "./../middlewares/auth";
import { controller, get, post, use } from "../decorators";
import { ticketServiceInsatance } from "../services/ticket";
import { NextFunction, Response } from "express";

@controller("/tickets")
class TicketController {
  @post("/generate")
  @use(auth)
  async handleOrderTicket(req: any, res: Response, next: NextFunction) {
    try {
      const ticket = await ticketServiceInsatance.orderTicket(
        req.user._id,
        req.body.ticket
      );
      res.json({
        status: "success",
        data: {
          ticket,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
