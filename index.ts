import { usersCollection } from './databaseConnector';
import { AddUserToDb, LoginUser, User } from './Helpers/User/UserService';
import express from "express"; 
import dotenv from 'dotenv'; 
import { Authenticate, GenerateToken } from './Helpers/Token/TokenService';
import { ResponseObject } from './Helpers/Response/Response';
import cookieParser from 'cookie-parser';
import { protectedRouter } from './routes/Protected/protectedRoute';
import cors from 'cors';
dotenv.config()

const app = express(); 
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }


app.use(express.json());
app.use(express.urlencoded())
app.use(cookieParser())
app.use(cors(corsOptions));
app.use(Authenticate);
app.use("/protected", protectedRouter);

export interface TypedRequest<T> extends Express.Request { 
    body: T
}

app.post("/register", async (req: TypedRequest<User>, res) => {
    const user = req.body;

    const token = GenerateToken(user, "15m");
    const userAddingToDbCheck = await AddUserToDb(user)
    if (!userAddingToDbCheck.success) { 
        return res.status(400).json(userAddingToDbCheck)
    }
    return res.status(200).cookie("accessToken", token, { httpOnly: true, secure: false}).json(new ResponseObject("Successfully registered", true));

})

app.post("/login", async (req: TypedRequest<User>, res) => { 
    const user = req.body; 

    try { 
        const userCheck = await LoginUser(user)
        if (!userCheck.success) { 
            return res.status(403).json(userCheck); 
        }

    } catch(err) { 
        console.log(err)
    }

    const token = GenerateToken(user, '15m'); 

    return res.status(200).cookie("accessToken", token, {httpOnly: true, secure: false}).json(new ResponseObject("Successfully logged in", true)); 

})

app.get("/protected/someData", Authenticate, async (req, res) => { 
    return res.status(200).json(new ResponseObject("Success", true, {array: ["1", "2", "3"]}))
})

app.listen(3000, () => { 
    console.log("Started server")
})