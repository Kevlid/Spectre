import { Module } from '@/types/module';

// Modules Imports
import { ConfigModule } from './config/module';
import { ActivityModule } from './activity/module';
import { ListModule } from './list/module';
import { ModerationModule } from './moderation/module';
import { PersistModule } from './persist/module';

export const ClientModules: Module[] = [
	ConfigModule,
	ActivityModule,
	ListModule,
	ModerationModule,
	PersistModule,
];
