import { ITicket, ITicketModel } from "./../@types/models/ticket";
import { model, Schema } from "mongoose";
import { Token, Container } from "typedi";

const ticketSchema: Schema<ITicket> = new Schema(
  {
    bus: { type: String, required: true },
    ticketId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      default: "active",
      enum: ["active", "canceled"],
    },
    seatNo: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    userName: { type: String, required: true },
  },
  { timestamps: true }
);

ticketSchema.methods.toJSON = function (this: ITicket): any {
  const clone: any = { ...this.toObject() };
  delete clone.__v;
  delete clone._id;
  return clone;
};

const Ticket = model<ITicket>("Tickets", ticketSchema);

export const TICKET_MODEL_TOKEN = new Token<ITicketModel>("ticket.model");
Container.set(TICKET_MODEL_TOKEN, Ticket);

export default Ticket;
