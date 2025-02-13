import { Client, Guild, GuildMember, User, TextChannel } from 'discord.js';

async function getOrFetchUser(client: Client, userId: string): Promise<User> {
    const user = client.users.cache.get(userId);
    if (!user) await client.users.fetch(userId);
    return user;
}

async function getOrFetchMember(guild: Guild, userId: string): Promise<GuildMember> {
    const member = guild.members.cache.get(userId);
    if (!member) await guild.members.fetch(userId);
    return member;
}

async function getOrFetchChannel(guild: Guild, channelId: string) {
    const channel = guild.channels.cache.get(channelId);
    if (!channel) await guild.channels.fetch(channelId);
    return channel;
}

async function getOrFetchRole(guild: Guild, roleId: string) {
    const role = guild.roles.cache.get(roleId);
    if (!role) await guild.roles.fetch(roleId);
    return role;
}

async function getOrFetchGuild(client: Client, guildId: string) {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) await client.guilds.fetch(guildId);
    return guild;
}

async function getOrFetchMessage(channel: TextChannel, messageId: string) {
    const message = await channel.messages.cache.get(messageId);
    if (!message) await channel.messages.fetch(messageId);
    return message;
}

export {
    getOrFetchUser,
    getOrFetchMember,
    getOrFetchChannel,
    getOrFetchRole,
    getOrFetchGuild,
    getOrFetchMessage
}