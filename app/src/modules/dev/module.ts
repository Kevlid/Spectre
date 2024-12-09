import { Module } from '@/types/module';

import { RestartPrefix } from './prefix/restart';

export const DevModule: Module = {
	id: 'dev',
	developerOnly: true,
	prefixCommands: [RestartPrefix],
};
