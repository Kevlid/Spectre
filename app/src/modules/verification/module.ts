import { Module } from '@/types/module';

// Events
import { GuildMemberAdd } from './events/guildMemberAdd';

export const verificationModule: Module = {
	id: 'verification',
	events: [GuildMemberAdd],
};
