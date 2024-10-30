import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('activity_status')
export class ActivityStatusEntity {
	@PrimaryColumn({ name: 'user_id' })
	userId: string;

	@Column({ name: 'user_name' })
	userName: string;

	@Column({ name: 'status' })
	status: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}
