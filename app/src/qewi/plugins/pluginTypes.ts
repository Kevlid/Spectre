import { Default } from "../types";
import { Command } from "../commands/commandTypes";
import { Event } from "../events/eventTypes";

export interface Plugin {
    id: string;
    type: PluginTypes;
    description?: string;

    settings?: {
        [key: string]: PluginSettings;
    };

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

export interface PluginSettings {
    types: PluginSettingsTypes[];
    default: any;
}

export enum PluginSettingsTypes {
    String = "string",
    Number = "number",
    Boolean = "boolean",
    Array = "array",
    Object = "object",
    Any = "any",
    Null = "null",
}
