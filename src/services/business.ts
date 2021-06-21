import { BusinessData, ITicketModel, IUserModel } from "../@types";
import { Container, Inject, Service } from "typedi";
import { TICKET_MODEL_TOKEN } from "../models/Ticket";
import { USER_MODEL_TOKEN } from "../models/User";

@Service()
class BusinessService {
  private readonly ticketModel: ITicketModel;
  private readonly userModel: IUserModel;
  constructor(
    @Inject(TICKET_MODEL_TOKEN) ticketModel: ITicketModel,
    @Inject(USER_MODEL_TOKEN) userModel: IUserModel
  ) {
    this.ticketModel = ticketModel;
    this.userModel = userModel;
  }

  async getBusinessData(): Promise<BusinessData> {
    const users = await this.userModel.find({});
    const tickets = await this.ticketModel.find({});
    const conductors = 20;

    return {
      users: users.length,
      tickets: tickets.length,
      conductors,
    };
  }
}

export const businessServiceInsatance = Container.get(BusinessService);
