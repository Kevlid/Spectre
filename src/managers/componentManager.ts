import { Collection, Interaction } from "discord.js";
import { KiwiClient } from "@/client";
import { SelectMenu, Button, CustomOptions } from "@/types/component";
import { EventList } from "@/types/event";

export class ComponentManager {
    private client: KiwiClient;
    public SelectMenus: Collection<string, SelectMenu>;
    public Buttons: Collection<string, Button>;

    public shortKeys: {
        [key: string]: string;
    };

    constructor(client: KiwiClient) {
        this.client = client;
        this.SelectMenus = new Collection();
        this.Buttons = new Collection();

        this.client.on(EventList.InteractionCreate, this.onInteraction.bind(this));

        this.shortKeys = {
            customId: "ci",
            ownerId: "oi",
            module: "mo",
            option: "op",
            userId: "ui",
            memberId: "mi",
        };
    }

    public getShortKey(value: string): string {
        return this.shortKeys[value] || value;
    }

    public getKeyFromShort(key: string | null): string | null {
        key = Object.keys(this.shortKeys).find((newKey) => this.shortKeys[newKey] === key) ?? null;
        return key;
    }

    public createCustomId(options: CustomOptions): string {
        var customId = new Array<string>();
        for (var [key, value] of Object.entries(options)) {
            if (customId.includes("&")) continue;
            if (!key || !value) continue;
            //key = this.getShortKey(key);
            customId.push(`${key}=${value}`);
        }
        return customId.join("&");
    }

    public decodeCustomId(customId: string): CustomOptions {
        let config: CustomOptions = {
            customId: customId,
        };
        for (const x of customId.split("&")) {
            let [key, value] = x.split("=");
            key = this.getKeyFromShort(key) ?? key;
            config[key] = value;
        }
        return config;
    }

    public registerSelectMenu(selectMenu: SelectMenu) {
        var customId = selectMenu.customId;
        this.SelectMenus.set(customId, selectMenu);
    }

    public registerButton(button: Button) {
        var customId = button.customId;
        this.Buttons.set(customId, button);
    }

    async onInteraction(interaction: Interaction) {
        if (!interaction.guild) return;
        if (!interaction.isMessageComponent()) return;

        var options = await this.decodeCustomId(interaction.customId);

        if (interaction.isAnySelectMenu()) {
            let selectMenu = this.SelectMenus.get(options.customId);
            if (!selectMenu) return;

            if (options.ownerId && options.ownerId != interaction.user.id) {
                interaction.reply({
                    content: "You are not the owner of this interaction",
                    ephemeral: true,
                });
                return;
            }

            await selectMenu.execute(this.client, interaction, options).catch((error) => {
                console.error(`Error in execute for selectMenu ${options.customId}:`, error);
            });
        } else if (interaction.isButton()) {
            let button = this.Buttons.get(options.customId);
            if (!button) return;

            if (options.ownerId && options.ownerId != interaction.user.id) {
                interaction.reply({
                    content: "You are not the owner of this interaction",
                    ephemeral: true,
                });
                return;
            }

            await button.execute(this.client, interaction, options).catch((error) => {
                console.error(`Error in execute for button ${options.customId}:`, error);
            });
        }
    }
}
