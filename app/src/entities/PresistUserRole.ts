import { Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('persist_roles')
export class PersistUserRoleEntity {
	@PrimaryColumn({ name: 'guild_id' })
	guildId: string;

	@PrimaryColumn({ name: 'user_id' })
	roleId: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}
