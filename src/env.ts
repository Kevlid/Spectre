import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    DISCORD_ID: process.env.DISCORD_ID,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,

    PREFIX: process.env.PREFIX || "?",
    DEVELOPERS: process.env.DEVELOPERS ? process.env.DEVELOPERS.split(",").map((dev) => dev.trim()) : [],

    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT || "5432",
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_NAME: process.env.POSTGRES_NAME,
};
