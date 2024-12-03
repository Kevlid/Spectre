import { Module } from '@/types/module';

// Prefix Commands
import { CleanPrefix } from './prefix/clean';
import { DeleteManyPrefix } from './prefix/delete-many';
import { TimeoutPrefix } from './prefix/timeout';
import { VoiceKickPrefix } from './prefix/voice-kick';
import { KickPrefix } from './prefix/kick';

export const ModerationModule: Module = {
	id: 'moderation',
	prefixCommands: [
		CleanPrefix,
		DeleteManyPrefix,
		KickPrefix,
		TimeoutPrefix,
		VoiceKickPrefix,
	],
};
