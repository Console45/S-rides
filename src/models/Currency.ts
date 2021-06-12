// import { Model, model, Schema } from "mongoose";
// import { Token, Container } from "typedi";

// const currencySchema: Schema<ICurrency> = new Schema<ICurrency>({
//   symbol: {
//     type: String,
//     required: true,
//     unique: true,
//     uppercase: true,
//     trim: true,
//   },
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   instock: {
//     type: Boolean,
//     default: true,
//   },
// });

// currencySchema.methods.toJSON = function (): any {
//   const clone: any = { ...this.toObject() };
//   delete clone.__v;
//   delete clone._id;
//   return clone;
// };

// const Currency = model<ICurrency>("Currency", currencySchema);

// export const CURRENCY_MODEL_TOKEN = new Token<Model<ICurrency>>(
//   "currency.model"
// );
// Container.set(CURRENCY_MODEL_TOKEN, Currency);

// export default Currency;
