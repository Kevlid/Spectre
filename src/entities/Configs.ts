import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("Configs")
export class Configs {
    @PrimaryColumn({ name: "guild_id" })
    guildId: string;

    @Column({ name: "config", type: "jsonb" })
    config: Record<string, any>;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
