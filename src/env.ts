import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    DISCORD_ID: process.env.DISCORD_ID as string,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN as string,

    PREFIX: process.env.PREFIX || "?",

    DB_HOST: process.env.DATABASE_HOST as string,
    DB_PORT: process.env.DATABASE_PORT as string,
    DB_USER: process.env.DATABASE_USER as string,
    DB_PASSWORD: process.env.DATABASE_PASSWORD as string,
    DB_NAME: process.env.DATABASE_NAME as string,
};
