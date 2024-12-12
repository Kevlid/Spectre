import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { VerificationConfigPingEntity } from './VerificationConfigPing';
import { VerificationConfigRoleEntity } from './VerificationConfigRole';

@Entity('verification_config')
export class VerificationConfigEntity {
	@PrimaryColumn({ name: 'guild_id' })
	guildId: string;

	@Column({ name: 'log_channel' })
	logChannel: string;

	@Column({ name: 'pending_channel' })
	pendingChannel: string;

	@OneToMany(
		() => VerificationConfigRoleEntity,
		(role) => role.verificationConfig,
		{
			cascade: true,
		}
	)
	pings: VerificationConfigRoleEntity[];

	@OneToMany(
		() => VerificationConfigRoleEntity,
		(role) => role.verificationConfig,
		{
			cascade: true,
		}
	)
	roles: VerificationConfigRoleEntity[];
}
