import jwt from "jsonwebtoken";
import { User } from "../User/UserService";
import { NextFunction, Request, Response } from "express";
import { ResponseObject } from "../Response/Response";
import { usersCollection } from "../../databaseConnector";
import { serialize } from "cookie";

const SECRET_KEY = process.env.SECRET_KEY ?? "another_Secret_dont_tell_anybody_pls";

export function GenerateToken(user: User, expiration: string | number = "15m") {
	return jwt.sign(user, SECRET_KEY, { expiresIn: expiration });
}

export async function Authenticate(req: Request, res: Response, next: NextFunction) {
	if (!req.path.includes("/protected")) return next();

	const { accessToken: token } = req.cookies;

	if (!token) {
		return res.status(403).json(new ResponseObject("Token should be provided!", false));
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY) as User;

		const fullUser = await usersCollection.findOne({ email: decoded.email });
		req.body.user = fullUser;
		res.setHeader(
			"Set-Cookie",
			SerializeToken(GenerateToken({ email: decoded.email, password: decoded.password }))
		);
		res.status(200);
	} catch (err) {
        const error = err as Error;

        // if jwt token expired, set jwtExpired: true, so client logged current user out.
        if (error.name == "TokenExpiredError") { 
            return res.status(403).json(new ResponseObject(error.message, false, {}, true));
        }
		return res.status(403).json(new ResponseObject(error.message, false));
	}
	next();
}
export function SerializeToken(token: string, maxAge?: number) {
	const maxAgeParam = maxAge ? maxAge : undefined;
	return serialize("accessToken", token, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
        path:"/",
		maxAge: maxAgeParam,
	});
}
