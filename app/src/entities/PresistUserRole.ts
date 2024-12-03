import { Entity, PrimaryColumn, CreateDateColumn, Column } from 'typeorm';

@Entity('persist_roles')
export class PersistUserRoleEntity {
	@PrimaryColumn({ name: 'guild_id' })
	guildId: string;

	@PrimaryColumn({ name: 'user_id' })
	userId: string;

	@Column({ name: 'role_id' })
	roleId: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}
