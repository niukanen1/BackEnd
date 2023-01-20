import express from 'express';
import { usersCollection } from '../../../databaseConnector';
import { ResponseObject } from '../../../Helpers/Response/Response';
import { ResetPassword, User } from '../../../Helpers/User/UserService';

export const UserRouter = express.Router(); 



UserRouter.get("/getUserInfo", async (req, res) => { 
    const {user}: {user: User} = req.body; 
    try { 
        const userInfo = await usersCollection.findOne({email: user.email});
        return res.status(200).json(new ResponseObject("Successfully parsed user data", true, userInfo as User));
    } catch (err) { 
        return res.status(500).json(new ResponseObject("Failed to get user data", false));
    }
});

UserRouter.post("/checkIfLoggedIn", async(req, res) => { 
    const {user}: {user:User} = req.body;  
    try { 
        const dbUser = await usersCollection.findOne({email: user.email});
        return res.json(new ResponseObject("You are logged in", true, dbUser as User));
    } catch (err) { 
        return res.json(new ResponseObject("Something went wrong", false));
    }
})

UserRouter.post("/resetPassword", async (req, res) => { 
    const {user, newPass}: {user: User, newPass: string} = req.body; 

    try { 
        ResetPassword(user, newPass);
        return res.status(200).json(new ResponseObject("Successfully changed pass", true)); 
    } catch (err) { 
        return res.status(403).json(new ResponseObject((err as Error).message, false))
    }
})