import { Module } from '@/types/module';

// Prefix Commands
import { VoiceKickPrefix } from './prefix/voice-kick';

export const ModerationModule: Module = {
	id: 'moderation',
	prefixCommands: [VoiceKickPrefix],
};
