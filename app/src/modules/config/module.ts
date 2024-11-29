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
import { ConfigToggleButton } from './buttons/configToggle';
import { ModuleInfoButton } from './buttons/moduleInfo';
import { ConfigCancelButton } from './buttons/configCancel';

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
	buttons: [ConfigToggleButton, ModuleInfoButton, ConfigCancelButton],
	default: true,
};
