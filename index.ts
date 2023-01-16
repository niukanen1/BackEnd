import { usersCollection } from "./databaseConnector";
import { AddUserToDb, LoginUser, User } from "./Helpers/User/UserService";
import express from "express";
import dotenv from "dotenv";
import { Authenticate, GenerateToken } from "./Helpers/Token/TokenService";
import { ResponseObject } from "./Helpers/Response/Response";
import cookieParser from "cookie-parser";
import { protectedRouter } from "./routes/Protected/protectedRoute";
import cors from "cors";
import { serialize } from "cookie"
dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
const corsOptions = {
	origin: true,
	credentials: true,
};

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(Authenticate);
app.use("/protected", protectedRouter);

app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

export interface TypedRequest<T> extends Express.Request {
	body: T;
}

export function SerializeToken(token: string) { 
    return serialize('accessToken', token, {
        httpOnly: true, 
        secure: false, 
    })
}


app.post("/register", async (req, res) => {
	const user = req.body;
    console.log(req.body);
    console.log(req.header);
    console.log(req.headers);
    console.log("user: ");
    console.log(user);

	const token = GenerateToken(user, "15m");
	const userAddingToDbCheck = await AddUserToDb(user);
	if (!userAddingToDbCheck.success) {
		return res.status(400).json(userAddingToDbCheck);
	}
    
    res.setHeader('Set-Cookie', SerializeToken(token));
	return res
		.status(200)
		// .cookie("accessToken", token, { httpOnly: true, secure: false, sameSite: 'none' })
		.json(new ResponseObject("Successfully registered", true));
});

app.post("/login", async (req: TypedRequest<User>, res) => {
	const user = req.body;

	try {
		const userCheck = await LoginUser(user);
		if (!userCheck.success) {
			return res.status(403).json(userCheck);
		}
	} catch (err) {
		console.log(err);
	}

	const token = GenerateToken(user, "15m");

    console.log("Generated token : " + token);
    res.setHeader('Set-Cookie', SerializeToken(token));
	return res
		.status(200)
		// .cookie("accessToken", token, { httpOnly: true, secure: false, sameSite: 'none'})
		.json(new ResponseObject("Successfully logged in", true));
});

app.get("/protected/someData", Authenticate, async (req, res) => {
	return res.status(200).json(new ResponseObject("Success", true, { array: ["1", "2", "3"] }));
});

app.listen(PORT, () => {
	console.log("Started server");
});
