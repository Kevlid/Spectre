import { DataSource, DataSourceOptions } from "typeorm";
import { env } from "./env";

export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT || "5432"),
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    entities: [__dirname + "/**/entities/*.ts", __dirname + "/**/entities/*.js"],
    migrations: [__dirname + "/**/migrations/*.ts", __dirname + "/**/migrations/*.js"],
    logging: ["error", "query"],
    synchronize: false,
};

export const dataSource = new DataSource(dataSourceOptions);
