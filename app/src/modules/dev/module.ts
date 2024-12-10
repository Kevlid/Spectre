import { Module } from '@/types/module';

import { CleanDatabasePrefix } from './prefix/clean-database';
import { RandomColorPrefix } from './prefix/random-color';
import { RestartPrefix } from './prefix/restart';

export const DevModule: Module = {
	id: 'dev',
	developerOnly: true,
	prefixCommands: [CleanDatabasePrefix, RandomColorPrefix, RestartPrefix],
};
