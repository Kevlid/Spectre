import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateActivtyTables1740654207663 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE activity_users (
                guild_id BIGINT UNSIGNED NOT NULL,
                user_id BIGINT UNSIGNED NOT NULL,
                user_name VARCHAR(32) NOT NULL,
                total_seconds INT NOT NULL DEFAULT 0,
                daily_seconds INT NOT NULL DEFAULT 0,
                weekly_seconds INT NOT NULL DEFAULT 0,
                monthly_seconds INT NOT NULL DEFAULT 0,
                yearly_seconds INT NOT NULL DEFAULT 0,
                total_messages INT NOT NULL DEFAULT 0,
                daily_messages INT NOT NULL DEFAULT 0,
                weekly_messages INT NOT NULL DEFAULT 0,
                monthly_messages INT NOT NULL DEFAULT 0,
                yearly_messages INT NOT NULL DEFAULT 0,
                seconds_from TIMESTAMP NULL DEFAULT NULL,
                joined_voice_at TIMESTAMP NULL DEFAULT NULL,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (guild_id, user_id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE activity_users`);
    }
}
