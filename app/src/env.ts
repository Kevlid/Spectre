import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    CLIENT_ID: process.env.CLIENT_ID as string,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN as string,

    PREFIX: "!",
    STAFF_USERS: (process.env.STAFF_USERS?.split(",") || []) as string[],

    RESTART_WEBHOOK_URL: process.env.RESTART_WEBHOOK_URL as string,

    DATABASE_URL: process.env.DATABASE_URL as string,
};
