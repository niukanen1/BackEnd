import { TypedRequest } from "../..";
import { usersCollection } from "../../databaseConnector";
import { ResponseObject } from "../Response/Response";
import { User } from "../User/UserService";

export enum MovieType {
    favorite = 'favoriteMovies',
    watchLater = 'watchLaterMovies'
}

// adds movie to given user, then returns updated user object
export async function addMovie(req: TypedRequest<{movieID: number} & {user: User}>, movieType: MovieType) { 
    const {movieID} = req.body;
    const {user} = req.body;

    if (user.favoriteMovies == undefined) { 
        user.favoriteMovies = [];
    }
    if (user.watchLaterMovies == undefined) { 
        user.watchLaterMovies = [];
    }
    user[movieType]?.push(movieID); 
    
    // apply changes to database
    try { 
        await usersCollection.updateOne({email: user.email}, {$set: user}); 
    } catch (err) { 
        return new ResponseObject((err as Error).message, false); 
    }   

    return new ResponseObject("Successfully added movie to " + movieType, true)
}

export async function deleteMovie(req:TypedRequest<{movieID: number} & {user: User}>, movieType: MovieType) { 
    const {movieID} = req.body;
    const {user} = req.body;

    const oldLength = user[movieType]?.length; 
    user.favoriteMovies = user[movieType]?.filter(element => element != movieID); 

    try { 
        await usersCollection.updateOne({email: user.email}, {$set: user}); 
    } catch(err) { 
        return new ResponseObject((err as Error).message, false ); 
    } 

    if (user[movieType]?.length == oldLength) { 
        return new ResponseObject("Failed to delete the movie", false); 
    }

    return new ResponseObject("Successfully deleted movie from " + movieType, true);
}