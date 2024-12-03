import { Module } from '@/types/module';

// Events
import { GuildMemberAdd } from './events/guildMemberAdd';
import { GuildMemberUpdate } from './events/guildMemberUpdate';
import { GuildReady } from './events/guildReady';
import { GuildRoleDelete } from './events/guildRoleDelete';

export const PersistModule: Module = {
	id: 'persist',
	events: [GuildMemberAdd, GuildMemberUpdate, GuildReady, GuildRoleDelete],
};
