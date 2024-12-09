import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateModerationTables1732994662398 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'moderation_config',
				columns: [
					{
						name: 'guild_id',
						type: 'bigint',
						isPrimary: true,
						isNullable: false,
						unsigned: true,
					},
					{
						name: 'log_channel',
						type: 'bigint',
						isNullable: true,
						unsigned: true,
						default: null,
					},
				],
			}),
			true
		);

		await queryRunner.createTable(
			new Table({
				name: 'moderation_config_roles',
				columns: [
					{
						name: 'id',
						type: 'bigint',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
					},
					{
						name: 'guild_id',
						type: 'bigint',
						isNullable: false,
						unsigned: true,
					},
					{
						name: 'role_id',
						type: 'bigint',
						isNullable: false,
						unsigned: true,
					},
				],
				foreignKeys: [
					{
						columnNames: ['guild_id'],
						referencedTableName: 'moderation_config',
						referencedColumnNames: ['guild_id'],
						onDelete: 'CASCADE',
					},
				],
			}),
			true
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('moderation_config_roles');
		await queryRunner.dropTable('moderation_config');
	}
}
