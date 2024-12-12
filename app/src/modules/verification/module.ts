import { Module } from '@/types/module';

// Buttons
import { ApproveUserButton } from './buttons/approveUser';
import { DenyUserButton } from './buttons/denyUser';

// Events
import { GuildMemberAdd } from './events/guildMemberAdd';
import { GuildReady } from './events/guildReady';

// Select Menus
import { VerifyRoleSelectMenu } from './selectmenus/verifyRole';

export const verificationModule: Module = {
	id: 'verification',
	buttons: [ApproveUserButton, DenyUserButton],
	events: [GuildMemberAdd, GuildReady],
	selectMenus: [VerifyRoleSelectMenu],
};
