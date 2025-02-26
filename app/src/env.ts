import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    CLIENT_ID: process.env.CLIENT_ID as string,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN as string,

    PREFIX: "!",
    STAFF_USERS: (process.env.STAFF_USERS?.split(",") || []) as string[],
    STAFF_SERVERS: (process.env.STAFF_SERVERS?.split(",") || []) as string[],

    POSTGRES_HOST: process.env.POSTGRES_HOST as string,
    POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT as string, 10),
    POSTGRES_USER: process.env.POSTGRES_USER as string,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD as string,
    POSTGRES_DB: process.env.POSTGRES_DB as string,
};
