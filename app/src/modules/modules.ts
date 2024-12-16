import { Module } from "@/types/module";

// Modules Imports
import { ConfigModule } from "./config/module";
import { ActivityModule } from "./activity/module";
import { DevModule } from "./dev/module";
import { ListModule } from "./list/module";
import { LoggingModule } from "./logging/module";
import { ModerationModule } from "./moderation/module";
import { PersistModule } from "./persist/module";
import { VerificationModule } from "./verification/module";

export const ClientModules: Module[] = [
	ConfigModule,
	ActivityModule,
	DevModule,
	ListModule,
	LoggingModule,
	ModerationModule,
	PersistModule,
	VerificationModule,
];
