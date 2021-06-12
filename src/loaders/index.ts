import "./controllers";
import "../utils/run-error";
import { Application } from "express";
import { appLoader } from "./app";
import { connectDatabase } from "./database-config";

export default async (app: Application) => {
  await connectDatabase();
  console.log("✌️ DB loaded and connected!");

  await appLoader({ app });
  console.log("✌️ App Loaded!");
};
