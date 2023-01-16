import jwt from "jsonwebtoken";
import { User } from "../User/UserService";
import { NextFunction, Request, Response } from "express";
import { ResponseObject } from "../Response/Response";
import { SerializeToken, TypedRequest } from "../..";
import { usersCollection } from "../../databaseConnector";

const SECRET_KEY = process.env.SECRET_KEY ?? "another_Secret_dont_tell_anybody_pls";


export function GenerateToken( user: User, expiration: string | number = '1m' ) { 
    return jwt.sign(user, SECRET_KEY, {expiresIn: expiration});
}

export async function Authenticate(req: Request, res: Response, next: NextFunction) { 
    if (!req.path.includes("/protected")) return next(); 
    console.log("AUTH");
    console.log(req.body);
    console.log(req.header);
    console.log(req.headers);
    const {accessToken: token} = req.cookies; 
    console.log(req.cookies);

    console.log("accessToken: " + token);
    
    if (!token) { 
        return res.status(403).json(new ResponseObject("Token should be provided!", false));
    }

    try { 
        const decoded = jwt.verify(token, SECRET_KEY) as User;
        const fullUser = await usersCollection.findOne({email: decoded.email});
        req.body.user = fullUser; 
        res.setHeader('Set-Cookie', SerializeToken(GenerateToken({ email: decoded.email, password: decoded.password}, '15m')));
        res.status(200)
        // .cookie("accessToken", GenerateToken({ email: decoded.email, password: decoded.password}, '15m'), {httpOnly: true, secure: false, sameSite: 'none'});
        
        
        // jwt.verify(token, SECRET_KEY, (err: any, user: any) => { 
        //     if (err != undefined) { 
        //         console.log("error")
        //         return res.status(403).send(new ResponseObject("Token is not valid", false));
        //     }
        //     console.log(user)
        //     // res.status(200).cookie("accessToken", GenerateToken(user, '1h'), {httpOnly: true, secure: false});
        //     req.body.user = user;
        // });
    }
    catch (err) { 
        // console.log((err as Error));
        return res.status(403).json(new ResponseObject((err as Error).message, false));
    }
    next()
}
