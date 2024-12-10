import { Module } from '../../types/module';

import { PermissionFlagsBits, Permissions } from 'discord.js';

// Events
import { GuildCreate } from './events/guildCreate';
import { GuildReady } from './events/guildReady';

// Prefix Commands
import { ConfigPrefix } from './prefix/config';

// Select Menus
import { ConfigChannelSelectMenu } from './selectmenus/configChannel';
import { ConfigRoleSelectMenu } from './selectmenus/configRole';
import { ConfigModuleSelectMenu } from './selectmenus/configModule';
import { ConfigOptionSelectMenu } from './selectmenus/configOption';

// Slash Commands
import { ConfigSlash } from './slash/config';

// Buttons
import { ConfigButton } from './buttons/configButton';

export const ConfigModule: Module = {
	id: 'config',
	permissions: [PermissionFlagsBits.Administrator],
	events: [GuildCreate, GuildReady],
	prefixCommands: [ConfigPrefix],
	selectMenus: [
		ConfigChannelSelectMenu,
		ConfigRoleSelectMenu,
		ConfigModuleSelectMenu,
		ConfigOptionSelectMenu,
	],
	slashCommands: [ConfigSlash],
	buttons: [ConfigButton],
	default: true,
};
