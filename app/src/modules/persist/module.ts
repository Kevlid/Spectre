import { Module } from '@/types/module';

// Events
import { GuildMemberAdd } from './events/guildMemberAdd';
import { GuildMemberUpdate } from './events/guildMemberUpdate';

export const PersistModule: Module = {
	id: 'persist',
	events: [GuildMemberAdd, GuildMemberUpdate],
};
