import { auth } from "./../middlewares/auth";
import { controller, post, use } from "../decorators";
import { ticketServiceInsatance } from "../services/ticket";
import { NextFunction, Response } from "express";

@controller("/tickets")
class TicketController {
  @post("/order")
  @use(auth)
  async handleOrderTicket(req: any, res: Response, next: NextFunction) {
    try {
      const ticket = await ticketServiceInsatance.orderTicket(
        req.user,
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
