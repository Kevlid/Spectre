import { Interaction } from 'discord.js';
import { KiwiClient } from '@/client';

interface Options {
	[key: string]: (
		interaction: Interaction,
		client: KiwiClient
	) => Promise<void>;
	beforeAll?: (interaction: Interaction, client: KiwiClient) => Promise<void>;
	afterAll?: (interaction: Interaction, client: KiwiClient) => Promise<void>;
}

export const options: Options = {
	beforeAll: async (interaction, client) => {
		// Code here
	},
	presistRoles: async (interaction, client) => {
		// Code here
	},
	afterAll: async (interaction, client) => {
		// Code here
	},
};
