import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { PersistConfigRole } from './PersistConfigRole';

@Entity('persist_config')
export class PersistConfig {
	@PrimaryColumn('bigint', { unsigned: true })
	guild_id: string;

	@Column('bigint', { nullable: true, unsigned: true, default: null })
	log_channel: string | null;

	@Column('boolean', { default: false })
	nicknames: boolean;

	@OneToMany(() => PersistConfigRole, (role) => role.persistConfig)
	roles: PersistConfigRole[];
}
