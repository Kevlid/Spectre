import { Module } from "@/types/module";

// Prefix Commands
import { CleanPrefix } from "./prefix/clean";
import { DeleteManyPrefix } from "./prefix/delete-many";
import { DragPrefix } from "./prefix/drag";
import { TimeoutPrefix } from "./prefix/timeout";
import { VoiceKickPrefix } from "./prefix/voice-kick";

export const ModerationModule: Module = {
	id: "moderation",
	prefixCommands: [CleanPrefix, DeleteManyPrefix, DragPrefix, TimeoutPrefix, VoiceKickPrefix],
};
