import { ICurrency } from "./currency";
import { Document, Model } from "mongoose";

/**
 * Interface for the Rate Model
 * @interface IRate
 * @extends Document Mongoose Document Class
 */
export interface IRate extends Document {
  coin: ICurrency["_id"];
  currency: string;
  buyRate: number;
  sellRate: number;
}

export interface IRateModel extends Model<IRate> {}
