import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { VerificationConfigRoleEntity } from './VerificationConfigRole';

@Entity('verification_config')
export class VerificationConfigEntity {
	@PrimaryColumn({ name: 'guild_id' })
	guildId: string;

	@Column({ name: 'log_channel' })
	logChannel: string;

	@OneToMany(
		() => VerificationConfigRoleEntity,
		(role) => role.verificationConfig,
		{
			cascade: true,
		}
	)
	roles: VerificationConfigRoleEntity[];
}
