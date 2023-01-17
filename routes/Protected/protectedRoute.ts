import express, { Router } from "express";
import { ResponseObject } from "../../Helpers/Response/Response";
import { movieRouter } from "./Movies/MovieRouter";
import { UserRouter } from "./User/UserRouter";

export const protectedRouter: Router = express.Router(); 

protectedRouter.use("/movies", movieRouter);
protectedRouter.use("/user", UserRouter);