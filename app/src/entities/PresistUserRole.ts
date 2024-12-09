import { Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('persist_user_roles')
export class PersistUserRoleEntity {
	@PrimaryColumn({ name: 'guild_id' })
	guildId: string;

	@PrimaryColumn({ name: 'user_id' })
	userId: string;

	@PrimaryColumn({ name: 'role_id' })
	roleId: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}
