import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ModerationConfigRoleEntity } from './ModerationConfigRole';

@Entity('moderation_config')
export class ModerationConfigEntity {
	@PrimaryColumn({ name: 'guild_id' })
	guildId: string;

	@Column({ name: 'log_channel' })
	logChannel: string;

	@OneToMany(
		() => ModerationConfigRoleEntity,
		(role) => role.moderationConfig,
		{
			cascade: true,
		}
	)
	roles: ModerationConfigRoleEntity[];
}
