import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConfigTables1633024800000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE guild_configs (
                guild_id BIGINT UNSIGNED NOT NULL,
                guild_name VARCHAR(32) NOT NULL,
                config JSON NOT NULL,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (guild_id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE plugin_configs (
                guild_id BIGINT UNSIGNED NOT NULL,
                plugin_name VARCHAR(32) NOT NULL,
                config JSON NOT NULL,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (guild_id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE guild_configs`);
        await queryRunner.query(`DROP TABLE plugin_configs`);
    }
}
