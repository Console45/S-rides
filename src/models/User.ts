import { Container, Token } from "typedi";
import { Schema, model, HookNextFunction, SchemaTypes } from "mongoose";
import validator from "validator";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import keys from "../constants/keys";
import { authLogger, UnAuthorizedRequest } from "../utils";
import { IUser, IUserModel } from "../@types";
import Ticket from "./Ticket";

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    fullname: { type: String, trim: true, required: true },
    email: {
      type: String,
      trim: true,
      unique: true,
      rquired: true,
      validate(value: string): void {
        if (!validator.isEmail(value)) throw new Error("not an email");
      },
    },
    studentId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: { type: String, trim: true, required: true, minlength: 6 },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tickets", {
  ref: "Tickets",
  localField: "_id",
  foreignField: "user",
});

userSchema.methods.toJSON = function (this: IUser): any {
  const clone: any = { ...this.toObject() };
  delete clone.__v;
  delete clone.password;
  delete clone.refreshTokenVersion;
  delete clone.accessTokenVersion;
  return clone;
};

userSchema.statics.findByCredentials = async (
  studentId: string,
  password: string
) => {
  const user: IUser | null = await User.findOne({ studentId });
  let message: string = "Invalid credentials";
  if (!user) {
    authLogger.error(`message:${message},email:${studentId}`);
    throw new UnAuthorizedRequest(message);
  }
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    authLogger.error(`message:${message},email:${studentId}`);
    throw new UnAuthorizedRequest(message);
  }
  return user;
};

userSchema.methods.createAccessToken = function (
  this: IUser,
  expires: string | undefined = undefined
): string {
  const accessToken: string = sign(
    { userId: this._id.toString(), tokenVersion: this.accessTokenVersion },
    keys.JWT_ACCESS_TOKEN_SECRET,
    expires ? { expiresIn: expires } : undefined
  );
  return accessToken;
};

userSchema.pre<IUser>(
  "save",
  async function (next: HookNextFunction): Promise<void> {
    if (this.isModified("password"))
      this.password = await hash(this.password, 8);
    next();
  }
);

const User = model<IUser, IUserModel>("Users", userSchema);

export const USER_MODEL_TOKEN = new Token<IUserModel>("user.model");
Container.set(USER_MODEL_TOKEN, User);

export default User;
