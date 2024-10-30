import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
} from 'typeorm';

@Entity('activity_status')
export class ActivityStatusEntity {
	@PrimaryGeneratedColumn({ name: 'id' })
	id: number;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'user_name' })
	userName: string;

	@Column({ name: 'status' })
	status: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}
