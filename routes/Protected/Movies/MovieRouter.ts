import express from "express";
import { TypedRequest } from "../../..";
import { usersCollection } from "../../../databaseConnector";
import { addMovie, deleteMovie, MovieType } from "../../../Helpers/Movie/MovieService";
import { ResponseObject } from "../../../Helpers/Response/Response";
import { User } from "../../../Helpers/User/UserService";

export const movieRouter = express.Router();

movieRouter.post("/addFavoriteMovie", async (req: TypedRequest<{movieID: number} & {user: User}>, res) => { 
 
    const response = await addMovie(req, MovieType.favorite); 
    if (!response.success) { 
        return res.status(400).json(response); 
    }
    return res.status(200).json(response); 
})

movieRouter.post("/addWatchLaterMovie", async (req: TypedRequest<{movieID: number} & {user: User}>, res) => { 
 
    const response = await addMovie(req, MovieType.watchLater); 
    if (!response.success) { 
        return res.status(400).json(response); 
    }
    return res.status(200).json(response); 
})

movieRouter.post("/deleteFavoriteMovie", async (req: TypedRequest<{movieID: number} & {user: User}>, res) => { 
    const response = await deleteMovie(req, MovieType.favorite); 
    if (!response.success) { 
        return res.status(400).json(response); 
    }
    return res.status(200).json(response); 
})

movieRouter.post("/deleteWatchLaterMovie", async (req: TypedRequest<{movieID: number} & {user: User}>, res) => { 
    const response = await deleteMovie(req, MovieType.watchLater); 
    if (!response.success) { 
        return res.status(400).json(response); 
    }
    return res.status(200).json(response); 
})

movieRouter