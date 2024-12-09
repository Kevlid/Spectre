import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('activity_voicestates')
export class ActivityVoicestateEntity {
	@PrimaryColumn({ name: 'guild_id' })
	guildId: string;

	@PrimaryColumn({ name: 'user_id' })
	userId: string;

	@UpdateDateColumn({ name: 'last_update' })
	lastUpdate: Date;

	@CreateDateColumn({ name: 'joined_at' })
	joinedAt: Date;
}
