import { EventEmitter } from "events";

export enum Events {
  REFRESH_TOKEN = "refresh-Token",
  REGISTER_USER = "register-user",
  LOGIN_USER = "login-user",
  LOGOUT_USER = "logout-user",
}
export const eventEmitter = new EventEmitter();
