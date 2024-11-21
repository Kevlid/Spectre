import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePersistTables1732194477315 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'persist_config',
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
					{
						name: 'nicknames',
						type: 'boolean',
						default: false,
					},
				],
			}),
			true
		);

		await queryRunner.createTable(
			new Table({
				name: 'persist_config_roles',
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
						referencedTableName: 'persist_config',
						referencedColumnNames: ['guild_id'],
						onDelete: 'CASCADE',
					},
				],
			}),
			true
		);

		await queryRunner.createTable(
			new Table({
				name: 'persist_nicknames',
				columns: [
					{
						name: 'guild_id',
						type: 'bigint',
						isPrimary: true,
						isNullable: false,
						unsigned: true,
					},
					{
						name: 'user_id',
						type: 'bigint',
						isPrimary: true,
						isNullable: false,
						unsigned: true,
					},
					{
						name: 'nickname',
						type: 'varchar',
						length: '32',
						isNullable: false,
					},
					{
						name: 'created_at',
						type: 'timestamp',
						default: 'CURRENT_TIMESTAMP',
						isNullable: false,
					},
					{
						name: 'updated_at',
						type: 'timestamp',
						default: 'CURRENT_TIMESTAMP',
						onUpdate: 'CURRENT_TIMESTAMP',
						isNullable: false,
					},
				],
			}),
			true
		);

		await queryRunner.createTable(
			new Table({
				name: 'persist_roles',
				columns: [
					{
						name: 'guild_id',
						type: 'bigint',
						isPrimary: true,
						isNullable: false,
						unsigned: true,
					},
					{
						name: 'role_id',
						type: 'bigint',
						isPrimary: true,
						isNullable: false,
						unsigned: true,
					},
					{
						name: 'created_at',
						type: 'timestamp',
						default: 'CURRENT_TIMESTAMP',
						isNullable: false,
					},
				],
			}),
			true
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('persist_config');
		await queryRunner.dropTable('persist_config_roles');
		await queryRunner.dropTable('persist_nicknames');
		await queryRunner.dropTable('persist_roles');
	}
}
