import { Document, Model } from "mongoose";

/**
 * Interface for the Rate Model
 * @interface ITicket
 * @extends Document Mongoose Document Class
 */

enum Status {
  Active = "active",
  Canceled = "canceled",
}
export interface ITicket extends Document {
  busName: String;
  ticketId: String;
  status: Status;
  seatNo: String;
  from: String;
  to: string;
  userName: string;
}

export interface ITicketModel extends Model<ITicket> {}
