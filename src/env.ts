import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    DISCORD_ID: process.env.DISCORD_ID as string,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN as string,

    PREFIX: process.env.PREFIX || "?",

    POSTGRES_HOST: process.env.POSTGRES_HOST as string,
    POSTGRES_PORT: process.env.POSTGRES_PORT as string,
    POSTGRES_USER: process.env.POSTGRES_USER as string,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD as string,
    POSTGRES_NAME: process.env.POSTGRES_NAME as string,
};
