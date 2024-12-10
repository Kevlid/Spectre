import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { VerificationConfigEntity } from './VerificationConfig';

@Entity('verification_config_roles')
export class VerificationConfigRoleEntity {
	@PrimaryGeneratedColumn({ name: 'id' })
	id: number;

	@Column({ name: 'guild_id' })
	guildId: string;

	@Column({ name: 'role_id' })
	roleId: string;

	@ManyToOne(
		() => VerificationConfigEntity,
		(verificationConfig) => verificationConfig.roles
	)
	@JoinColumn({ name: 'guild_id' })
	verificationConfig: VerificationConfigEntity;
}
