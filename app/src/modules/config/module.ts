import { Module } from '../../types/module';

// Events
import { GuildCreate } from './events/guildCreate';
import { GuildReady } from './events/guildReady';

// Slash Commands
import { ConfigSlash } from './commands/config';

// Select Menus
import { ConfigChannelSelectMenu } from './selectmenus/configChannel';
import { ConfigRoleSelectMenu } from './selectmenus/configRole';
import { ConfigModuleSelectMenu } from './selectmenus/configModule';
import { ConfigOptionSelectMenu } from './selectmenus/configOption';

// Buttons
import { ConfigDisableButton } from './buttons/configDisable';
import { ConfigEnableButton } from './buttons/configEnable';

export const ConfigModule: Module = {
	id: 'config',
	events: [GuildCreate, GuildReady],
	slashCommands: [ConfigSlash],
	selectMenus: [
		ConfigChannelSelectMenu,
		ConfigRoleSelectMenu,
		ConfigModuleSelectMenu,
		ConfigOptionSelectMenu,
	],
	buttons: [ConfigDisableButton, ConfigEnableButton],
	default: true,
};
