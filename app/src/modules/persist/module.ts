import { Module } from '@/types/module';

// Events
import { GuildMemberUpdate } from './events/guildMemberUpdate';

export const PersistModule: Module = {
	id: 'persist',
	events: [GuildMemberUpdate],
};
