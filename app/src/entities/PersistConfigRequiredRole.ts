import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { PersistConfigEntity } from './PersistConfig';

@Entity('persist_config_required_roles')
export class PersistConfigRequiredRoleEntity {
	@PrimaryGeneratedColumn({ name: 'id' })
	id: number;

	@Column({ name: 'guild_id' })
	guildId: string;

	@Column({ name: 'role_id' })
	roleId: string;

	@ManyToOne(
		() => PersistConfigEntity,
		(persistConfig) => persistConfig.requiredRoles
	)
	@JoinColumn({ name: 'guild_id' })
	persistConfig: PersistConfigEntity;
}
