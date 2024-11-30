import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { ModerationConfigEntity } from './ModerationConfig';

@Entity('moderation_config_roles')
export class ModerationConfigRoleEntity {
	@PrimaryGeneratedColumn({ name: 'id' })
	id: number;

	@Column({ name: 'guild_id' })
	guildId: string;

	@Column({ name: 'role_id' })
	roleId: string;

	@ManyToOne(
		() => ModerationConfigEntity,
		(persistConfig) => persistConfig.roles
	)
	@JoinColumn({ name: 'guild_id' })
	moderationConfig: ModerationConfigEntity;
}
