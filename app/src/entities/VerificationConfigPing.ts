import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { VerificationConfigEntity } from './VerificationConfig';

@Entity('verification_config_pings')
export class VerificationConfigPingEntity {
	@PrimaryGeneratedColumn({ name: 'id' })
	id: number;

	@Column({ name: 'guild_id' })
	guildId: string;

	@Column({ name: 'role_id' })
	roleId: string;

	@ManyToOne(
		() => VerificationConfigEntity,
		(verificationConfig) => verificationConfig.pings
	)
	@JoinColumn({ name: 'guild_id' })
	verificationConfig: VerificationConfigEntity;
}
