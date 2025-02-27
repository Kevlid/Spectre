import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("activity_users")
export class ActivityUser {
    @PrimaryColumn({ name: "guild_id" })
    guildId: string;

    @PrimaryColumn({ name: "user_id" })
    userId: string;

    @Column({ name: "user_name" })
    userName: string;

    @Column({ name: "total_seconds" })
    totalSeconds: number;

    @Column({ name: "daily_seconds" })
    dailySeconds: number;

    @Column({ name: "weekly_seconds" })
    weeklySeconds: number;

    @Column({ name: "monthly_seconds" })
    monthlySeconds: number;

    @Column({ name: "yearly_seconds" })
    yearlySeconds: number;

    @Column({ name: "total_messages" })
    totalMessages: number;

    @Column({ name: "daily_messages" })
    dailyMessages: number;

    @Column({ name: "weekly_messages" })
    weeklyMessages: number;

    @Column({ name: "monthly_messages" })
    monthlyMessages: number;

    @Column({ name: "yearly_messages" })
    yearlyMessages: number;

    @Column({ name: "seconds_from" })
    secondsFrom: Date;

    @Column({ name: "joined_voice_at" })
    joinedVoiceAt: Date;

    @CreateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @UpdateDateColumn({ name: "created_at" })
    createdAt: Date;
}
