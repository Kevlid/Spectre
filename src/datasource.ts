import { DataSource, DataSourceOptions } from "typeorm";
import { env } from "./env";

export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: env.POSTGRES_HOST,
    port: parseInt(env.POSTGRES_PORT || "5432"),
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_NAME,
    synchronize: false,
    logging: false,
    entities: [__dirname + "/entities/*{.ts,.js}"],
    migrations: [__dirname + "/migrations/*{.ts,.js}"],
    subscribers: [
        // Add your subscribers here
    ],
};

export const dataSource = new DataSource(dataSourceOptions);
