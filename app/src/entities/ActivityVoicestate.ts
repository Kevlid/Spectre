import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('activity_voicestates')
export class ActivityVoicestateEntity {
	@PrimaryGeneratedColumn()
	_id: number;

	@Column({ name: 'guild_id' })
	guildId: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'channel_id' })
	channelId: string;

	@Column({ name: 'saved_total_seconds' })
	savedTotalSeconds: boolean;

	@Column({ name: 'saved_daily_seconds' })
	savedDailySeconds: boolean;

	@Column({ name: 'saved_weekly_seconds' })
	savedWeeklySeconds: boolean;

	@Column({ name: 'saved_monthly_seconds' })
	savedMonthlySeconds: boolean;

	@Column({ name: 'joined_at' })
	joinedAt: Date;
}
