import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { PersistConfigRequiredRoleEntity } from './PersistConfigRequiredRole';
import { PersistConfigRoleEntity } from './PersistConfigRole';

@Entity('persist_config')
export class PersistConfigEntity {
	@PrimaryColumn({ name: 'guild_id' })
	guildId: string;

	@Column({ name: 'log_channel' })
	logChannel: string;

	@Column({ name: 'nicknames' })
	nicknames: boolean;

	@OneToMany(
		() => PersistConfigRequiredRoleEntity,
		(role) => role.persistConfig,
		{
			cascade: true,
		}
	)
	requiredRoles: PersistConfigRequiredRoleEntity[];

	@OneToMany(() => PersistConfigRoleEntity, (role) => role.persistConfig, {
		cascade: true,
	})
	persistRoles: PersistConfigRoleEntity[];
}
