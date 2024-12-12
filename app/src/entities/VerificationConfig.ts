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
		() => VerificationConfigPingEntity,
		(role) => role.verificationConfig,
		{
			cascade: true,
		}
	)
	pings: VerificationConfigPingEntity[];

	@OneToMany(
		() => VerificationConfigRoleEntity,
		(role) => role.verificationConfig,
		{
			cascade: true,
		}
	)
	roles: VerificationConfigRoleEntity[];
}
