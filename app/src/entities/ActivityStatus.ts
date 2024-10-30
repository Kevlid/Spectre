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

	@Column({ name: 'name' })
	name: string;

	@CreateDateColumn({ name: 'timestamp' })
	timestamp: Date;
}
