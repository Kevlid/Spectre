import { Default } from "../types";
import { Command } from "../commands/commandTypes";
import { Event } from "../events/eventTypes";

export interface Plugin {
    id: string;
    type: PluginTypes;
    description?: string;

    default?: Default;

    commands?: Array<Command>;
    events?: Array<Event>;

    beforeLoad?: (plugin: Plugin) => Promise<void> | void;
    afterLoad?: (plugin: Plugin) => Promise<void> | void;
    beforeUnload?: (plugin: Plugin) => Promise<void> | void;
    afterUnload?: (plugin: Plugin) => Promise<void> | void;
}

export enum PluginTypes {
    Global = "global",
    Guild = "guild",
}
