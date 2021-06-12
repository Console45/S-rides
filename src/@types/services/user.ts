import { IUser } from "../models/user";

export interface UpdateFields {
  name?: string;
  email?: string;
  phone?: string;
}

export interface UsersAndCount {
  count: number;
  users: IUser[];
}
