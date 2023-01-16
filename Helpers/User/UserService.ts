import { ObjectId } from "mongodb"
import { usersCollection } from "../../databaseConnector"
import { ResponseObject } from "../Response/Response"
import bcrypt from "bcrypt"
import { NextFunction } from "express";


const SALT_ROUNDS = 10;


export type User = { 
    _id?: ObjectId
    email: string 
    password: string
    favoriteMovies?: number[]
    watchLaterMovies?: number[]
}


export async function AddUserToDb(UserToAdd: User): Promise<ResponseObject> { 
    const newUser = UserToAdd;
    try { 
        const existingUser = await usersCollection.find({email: newUser.email}).toArray(); 
        if (existingUser.length > 0) { 
            throw new Error("User with this email already exists");
        }
        HashPassword(newUser.password, async (hash: string) => { 
            newUser.password = hash;
            await usersCollection.insertOne(newUser);
        }) 
        
    } catch (err: Error | unknown) { 
        return new ResponseObject((err as Error).message, false); 
    }
    return new ResponseObject("Successfully added user", true); 
}


// password comparison
export async function LoginUser(userToLogin: User): Promise<ResponseObject> { 
    const userFromDb: User = await usersCollection.findOne({email: userToLogin.email}) as User;  

    if (!userFromDb) { 
        return new ResponseObject("User doesn't exists", false); 
    }
    console.log("PASSTOLOGIN: " + userToLogin.password);
    console.log("PASSTOCOMPARE: " + userFromDb.password);
    const passwordMatch = await ComparePassword(userToLogin.password, userFromDb.password); 

    if (!passwordMatch) { 
        return new ResponseObject("Wrong Password", false); 
    }
    return new ResponseObject("Success", true); 
}


export async function ComparePassword(password: string, hashedPassword: string): Promise<boolean> { 
    return await bcrypt.compare(password, hashedPassword); 
}

export function HashPassword(password: string, completion: (hash: string) => void) { 
    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => { 
        if (err) { 
            console.log("Error hashing the password " + hash);
        }
        completion(hash)
    })
}   