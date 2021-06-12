import "reflect-metadata";
import express from "express";

const app: express.Application = express();

require("./loaders").default(app);

export default app;
