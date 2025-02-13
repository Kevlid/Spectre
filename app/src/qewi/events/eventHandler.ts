import { Qewi } from "../qewi";
import { PluginHandler } from "../plugins/pluginHandler";
import { ClientEvents } from "discord.js";
import { Event, EventList, Context } from "./eventTypes";

export class EventHandler {
    public globalListeners = new Map<string, Event>();
    public guildListeners = new Map<string, Map<string, Event>>();

    private qewi: Qewi;
    private pluginHandler: PluginHandler;
    constructor(qewi: Qewi) {
        this.qewi = qewi;
        this.pluginHandler = qewi.pluginHandler;

        // Bind event listeners
        for (const value of Object.values(EventList)) {
            this.qewi.client.on(value as keyof ClientEvents, (...args) => this._onEvent(value, ...args));
        }
    }

    private async _onEvent(key: string, ...args: any[]): Promise<void> {
        let guildId: string | null = null;

        // Determine guildId based on event type
        if (args[0] && "guild" in args[0]) {
            guildId = args[0].guild?.id || null;
        } else if (args[0] && "guildId" in args[0]) {
            guildId = args[0].guildId || null;
        }

        const event = this.getEvent(key, guildId);
        if (!event) return;
        const plugin = this.pluginHandler.getPlugin(event.pluginId, guildId);

        const ctx: Context = {
            qewi: this.qewi,
            client: this.qewi.client,
            plugin,
            event,
            guildId,
        };

        if (event.beforeTrigger) {
            await event.beforeTrigger(ctx, ...args);
        }
        await event.trigger(ctx, ...args);
        if (event.afterTrigger) {
            await event.afterTrigger(ctx, ...args);
        }
    }

    /* BOTH */

    public getEvent(eventId: string, guildId?: string): Event | null {
        var event = null;
        event = this.getGlobalEvent(eventId);
        if (!event && guildId) {
            event = this.getGuildEvent(guildId, eventId);
        }
        return event;
    }

    /* Global Events */

    public getGlobalEvent(eventId: string): Event | null {
        return this.globalListeners.get(eventId) || null;
    }

    public loadGlobalEvent(event: Event): void {
        if (this.getGlobalEvent(event.id)) {
            throw new Error(`Event ${event.id} is already loaded globally`);
        } else {
            this.globalListeners.set(event.id, event);
        }
    }

    public unloadGlobalEvent(eventId: string): void {
        const event = this.getGlobalEvent(eventId);
        if (event) {
            this.globalListeners.delete(eventId);
        } else {
            throw new Error(`Event ${eventId} is not loaded globally`);
        }
    }

    /* Guild Events */

    private _getGuildListeners(guildId: string): Map<string, Event> {
        var eventsMap = this.guildListeners.get(guildId);
        if (!eventsMap) {
            eventsMap = new Map<string, Event>();
        }
        return eventsMap;
    }

    private _getGuildListener(guildId: string, eventId: string): Event | null {
        return this._getGuildListeners(guildId).get(eventId) || null;
    }

    private _setGuildListener(guildId: string, eventId: string, event: Event): void {
        const guildEvents = this._getGuildListeners(guildId);
        guildEvents.set(eventId, event);
        this.guildListeners.set(guildId, guildEvents);
    }

    public getGuildEvent(guildId: string, eventId: string): Event | null {
        return this._getGuildListener(guildId, eventId);
    }

    public loadGuildEvent(guildId: string, event: Event): void {
        if (this.getGuildEvent(guildId, event.id)) {
            throw new Error(`Event ${event.id} is already loaded in guild ${guildId}`);
        } else {
            this._setGuildListener(guildId, event.id, event);
        }
    }

    public unloadGuildEvent(guildId: string, eventId: string): void {
        const event = this.getGuildEvent(guildId, eventId);
        if (event) {
            this._getGuildListeners(guildId).delete(eventId); // Remove event from guild (PROBABLY WONT WORK)
        } else {
            throw new Error(`Event ${eventId} is not loaded in guild ${guildId}`);
        }
    }
}
