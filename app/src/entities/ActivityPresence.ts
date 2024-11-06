import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('activity_presence')
export class ActivityPresenceEntity {
	@PrimaryGeneratedColumn({ name: 'id' })
	id: number;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'user_name' })
	userName: string;

	@Column({ name: 'name' })
	name: string;

	@Column({ name: 'type' })
	type: number;

	@Column({ name: 'start_timestamp' })
	startTimestamp: Date;

	@Column({ name: 'end_timestamp' })
	endTimestamp: Date;
}
