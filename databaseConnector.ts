import { MongoClient } from "mongodb";
import dotenv from "dotenv"
dotenv.config()

const URI = process.env.MONGO_URI;

const client = new MongoClient(URI ?? "");

const database = client.db("ababaTech_testTask");

export const usersCollection = database.collection("users");

client.connect().then(() => {
	console.log("Database is OK");
}).catch(err => { 
    console.log("Something went wrong " + err)
})
