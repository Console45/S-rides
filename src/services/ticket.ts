import { ApiError } from "./../utils/api-error";
import { USER_MODEL_TOKEN } from "./../models/User";
import { IUserModel, IUser, ITicketModel, ITicket } from "../@types";
import { Container, Inject, Service } from "typedi";
import { TICKET_MODEL_TOKEN } from "../models/Ticket";

@Service()
class TicketService {
  private readonly userModel: IUserModel;
  private readonly ticketModel: ITicketModel;
  constructor(
    @Inject(USER_MODEL_TOKEN) userModel: IUserModel,
    @Inject(TICKET_MODEL_TOKEN) ticketModel: ITicketModel
  ) {
    (this.userModel = userModel), (this.ticketModel = ticketModel);
  }

  /**
   * generate ticketID
   */
  private generateTicketId(): string {
    return `${Math.random().toString(10).substr(2, 9)}`;
  }

  public async orderTicket(user: string, ticketDetails: any): Promise<ITicket> {
    const ticketId = this.generateTicketId();
    const existingTicket = await this.ticketModel.findOne({
      ticketId: ticketId,
    });
    if (existingTicket) throw new ApiError(409, "Ticket already exists");
    const ticket = new this.ticketModel({ ticketId, ...ticketDetails, user });
    await ticket.save();
    return ticket;
  }
}

export const ticketServiceInsatance = Container.get(TicketService);
