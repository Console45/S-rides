import { EventEmitter } from "events";

export enum Events {
  REFRESH_TOKEN = "refresh-Token",
  REGISTER_USER = "register-user",
  LOGIN_USER = "login-user",
  LOGOUT_USER = "logout-user",
  FORGOT_PASSWORD = "forgot-password",
  RESET_PASSWORD = "reset-password",
  SEND_AUTH_CODE = "send-auth-code",
}
export const eventEmitter = new EventEmitter();
