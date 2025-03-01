import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("plugin_configs")
export class PluginConfig {
    @PrimaryColumn({ name: "guild_id" })
    guildId: string;

    @Column({ name: "guild_name" })
    guildName: string;

    @Column({ name: "config", type: "json" })
    config: any;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
