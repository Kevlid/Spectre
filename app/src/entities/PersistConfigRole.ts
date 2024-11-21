import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { PersistConfig } from './PersistConfig';

@Entity('persist_config_roles')
export class PersistConfigRole {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id: number;

	@Column({ type: 'bigint', nullable: false, unsigned: true })
	guild_id: number;

	@Column({ type: 'bigint', nullable: false, unsigned: true })
	role_id: number;

	@ManyToOne(() => PersistConfig, (persistConfig) => persistConfig.roles)
	@JoinColumn({ name: 'guild_id' })
	persistConfig: PersistConfig;
}
