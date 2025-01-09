import { dataSource } from "./datasource";
import { KiwiClient } from "./client";
import { env } from "./env";

async function bootstrap() {
	await dataSource.initialize();

	const client = new KiwiClient();
	await client.login(env.CLIENT_TOKEN);
}
bootstrap();
