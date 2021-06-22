import { Application, json, urlencoded } from "express";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import {
  stream,
  shouldCompress,
  AppRouter,
  apiErrorHandler,
  NotFoundError,
} from "../utils";

export const appLoader = async ({ app }: { app: Application }) => {
  /**
   * Middlewares
   */
  app.use(cors({ origin: "*" }));
  app.use(hpp());
  app.use(helmet());
  app.use(morgan("combined", { stream }));
  app.use(cookieParser());
  app.use(compression({ filter: shouldCompress }));
  app.use(json());
  app.use(urlencoded({ extended: false }));

  /**
   * Routes
   */
  app.use(AppRouter.instance);
  app.use(function (_, __, next) {
    next(new NotFoundError("Route does not exist"));
  });

  /**
   * Error handler
   */
  app.use(apiErrorHandler);
};
