import { KiwiClient } from "@/client";
import { Message } from "discord.js";
import { PrefixCommand } from "@/types/command";
import { respond } from "@/utils/respond";
import { Config } from "@/data/configs";

async function CheckOwner(client: KiwiClient, message: Message, ...args: any[]) {
    if (!message.guild) {
        await respond(message, "This command can only be used in a server");
        return false;
    }
    const ownerId = message.guild.ownerId;
    if (message.author.id !== ownerId) {
        await respond(message, "You must be the server owner to use this command");
        return false;
    }
    return true;
}

const ViewConfig: PrefixCommand = {
    config: {
        name: "config-view",
        description: "View the current configuration for the server",
        aliases: ["cfv"],
    },
    beforeExecute: CheckOwner,
    async execute(client, message) {
        if (!message.guild) {
            await respond(message, "This command can only be used in a server");
            return;
        }
        const configs = new Config().getSettings(message.guild.id);

        if (!configs) {
            await respond(message, "No configuration found for this server");
            return;
        }
        const configEntries = Object.entries(configs).map(([key, value]) => {
            return `**${key}**: ${value}`;
        });
        const configMessage = configEntries.length
            ? `Current configuration for this server:\n${configEntries.join("\n")}`
            : "No configuration settings found for this server.";
        await respond(message, configMessage);
    },
};

const UpdatePendingChannel: PrefixCommand = {
    config: {
        name: "config-update-pending-channel",
        description: "Update the pending channel for the server",
        aliases: ["cfupc"],
    },
    beforeExecute: CheckOwner,
    async execute(client, message, channelId) {
        if (!message.guild) {
            await respond(message, "This command can only be used in a server");
            return;
        }
        const channel = message.guild.channels.cache.get(channelId);
        if (!channel || !channel.isTextBased()) {
            await respond(message, "Invalid channel ID or the channel is not a text channel");
            return;
        }

        try {
            new Config().saveSetting(message.guild.id, "pending_channel", channelId);
        } catch (error) {
            console.error("Error saving pending channel:", error);
            await respond(message, "An error occurred while updating the pending channel. Please try again later.");
            return;
        }

        await respond(message, `Pending channel updated to <#${channel.id}>`);
    },
};

const UpdateVerificationLogChannel: PrefixCommand = {
    config: {
        name: "config-update-verification-log-channel",
        description: "Update the verification log channel for the server",
        aliases: ["cfuvlc"],
    },
    beforeExecute: CheckOwner,
    async execute(client, message, channelId) {
        if (!message.guild) {
            await respond(message, "This command can only be used in a server");
            return;
        }
        const channel = message.guild.channels.cache.get(channelId);
        if (!channel || !channel.isTextBased()) {
            await respond(message, "Invalid channel ID or the channel is not a text channel");
            return;
        }

        try {
            new Config().saveSetting(message.guild.id, "verification_log_channel", channelId);
        } catch (error) {
            console.error("Error saving verification log channel:", error);
            await respond(
                message,
                "An error occurred while updating the verification log channel. Please try again later."
            );
            return;
        }

        await respond(message, `Verification log channel updated to <#${channel.id}>`);
    },
};

const UpdateVerifiedRole: PrefixCommand = {
    config: {
        name: "config-update-verified-role",
        description: "Update the verified role for the server",
        aliases: ["cfuvr"],
    },
    beforeExecute: CheckOwner,
    async execute(client, message, roleId) {
        if (!message.guild) {
            await respond(message, "This command can only be used in a server");
            return;
        }
        const role = message.guild.roles.cache.get(roleId);
        if (!role) {
            await respond(message, "Invalid role ID or the role does not exist");
            return;
        }

        try {
            new Config().saveSetting(message.guild.id, "verified_role", roleId);
        } catch (error) {
            console.error("Error saving verified role:", error);
            await respond(message, "An error occurred while updating the verified role. Please try again later.");
            return;
        }

        await respond(message, `Verified role updated to ${role.name}`);
    },
};

export const ConfigCommands = [ViewConfig, UpdatePendingChannel, UpdateVerificationLogChannel, UpdateVerifiedRole];
