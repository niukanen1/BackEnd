import express, { Router } from "express";
import { ResponseObject } from "../../Helpers/Response/Response";
import { movieRouter } from "./Movies/MovieRouter";

export const protectedRouter: Router = express.Router(); 
protectedRouter.post("/logout", async (req, res) => {
    return res.clearCookie("accessToken").status(200).json(new ResponseObject("Successfully logged out", true)); 
})

protectedRouter.use("/movies", movieRouter);