import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { PersistConfigEntity } from './PersistConfig';

@Entity('persist_config_roles')
export class PersistConfigRoleEntity {
	@PrimaryGeneratedColumn({ name: 'id' })
	id: number;

	@Column({ name: 'guild_id' })
	guildId: number;

	@Column({ name: 'role_id' })
	roleId: number;

	@ManyToOne(
		() => PersistConfigEntity,
		(persistConfig) => persistConfig.roles
	)
	@JoinColumn({ name: 'guild_id' })
	persistConfig: PersistConfigEntity;
}
