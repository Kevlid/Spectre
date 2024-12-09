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

	@Column({ name: 'saved_total_seconds' })
	savedTotalSeconds: boolean;

	@Column({ name: 'saved_daily_seconds' })
	savedDailySeconds: boolean;

	@Column({ name: 'saved_weekly_seconds' })
	savedWeeklySeconds: boolean;

	@Column({ name: 'saved_monthly_seconds' })
	savedMonthlySeconds: boolean;

	@UpdateDateColumn({ name: 'last_update' })
	lastUpdate: Date;

	@CreateDateColumn({ name: 'joined_at' })
	joinedAt: Date;
}
