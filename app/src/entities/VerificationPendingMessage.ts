import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('verification_pending_messages')
export class VerificationPendingMessageEntity {
	@PrimaryColumn({ name: 'guild_id' })
	guildId: string;

	@PrimaryColumn({ name: 'user_id' })
	userId: string;

	@Column({ name: 'message_id' })
	messageId: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}
