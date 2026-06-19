import mangoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
let db;
export async function connectDB() {
    if (!db) {
        db = await mangoose.connect(process.env.DBURL) ;
    }
    return db;
};