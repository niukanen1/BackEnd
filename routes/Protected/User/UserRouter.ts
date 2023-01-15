import express from 'express';
import { usersCollection } from '../../../databaseConnector';
import { ResponseObject } from '../../../Helpers/Response/Response';
import { User } from '../../../Helpers/User/UserService';

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