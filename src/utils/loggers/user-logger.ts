import { transports } from "winston";
import { consoleTransportStreamOptons, logger } from ".";

export const userLogger = logger({ filename: "user.log" });

if (process.env.NODE_ENV === "development") {
  userLogger.add(new transports.Console(consoleTransportStreamOptons("info")));
}
