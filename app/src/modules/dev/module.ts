import { Module } from '@/types/module';

import { CleanDatabasePrefix } from './prefix/clean-database';
import { RestartPrefix } from './prefix/restart';

export const DevModule: Module = {
	id: 'dev',
	developerOnly: true,
	prefixCommands: [CleanDatabasePrefix, RestartPrefix],
};
