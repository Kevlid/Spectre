import { Module } from '@/types/module';

// Prefix Commands
import { CleanPrefix } from './prefix/clean';
import { VoiceKickPrefix } from './prefix/voice-kick';

export const ModerationModule: Module = {
	id: 'moderation',
	prefixCommands: [CleanPrefix, VoiceKickPrefix],
};
