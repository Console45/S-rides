import { transports } from "winston";
import { consoleTransportStreamOptons, logger } from ".";

export const authLogger = logger({ filename: "auth.log" });

if (process.env.NODE_ENV === "development") {
  authLogger.add(new transports.Console(consoleTransportStreamOptons("info")));
}
