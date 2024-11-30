import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { PersistConfigRoleEntity } from './PersistConfigRole';

@Entity('persist_config')
export class PersistConfigEntity {
	@PrimaryColumn({ name: 'guild_id' })
	guildId: string;

	@Column({ name: 'log_channel' })
	logChannel: string;

	@Column({ name: 'required_role' })
	requiredRole: string;

	@Column({ name: 'nicknames' })
	nicknames: boolean;

	@OneToMany(() => PersistConfigRoleEntity, (role) => role.persistConfig)
	persistRoles: PersistConfigRoleEntity[];
}
