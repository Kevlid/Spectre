import { env } from "./env";
import { connect } from "mongoose";

export const connectDB = async () => {
    try {
        const mongoURI: string = env.DATABASE_URL;
        await connect(mongoURI);
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error(err);
    }
};
