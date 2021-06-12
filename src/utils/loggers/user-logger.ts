import { transports } from "winston";
import {
  consoleTransportStreamOptons,
  logger,
  mongodbTransportStreamOptions,
} from ".";

export const userLogger = logger({ filename: "user.log" });

if (process.env.NODE_ENV === "development") {
  userLogger.add(new transports.Console(consoleTransportStreamOptons("info")));
}

if (process.env.NODE_ENV === "production") {
  userLogger.add(
    new transports.MongoDB(mongodbTransportStreamOptions("user_logs"))
  );
}
