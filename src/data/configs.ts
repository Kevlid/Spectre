import { dataSource } from "@/datasource";
import { Configs } from "../entities/Configs";
import { Repository } from "typeorm";

export class Config {
    private repository: Repository<Configs>;

    constructor() {
        this.repository = dataSource.getRepository(Configs);
    }

    public getSettings(guildId: string) {
        return this.repository.findOne({
            where: {
                guildId: guildId,
            },
        });
    }

    public saveSetting(guildId: string, key: String, value: any) {
        return this.repository
            .createQueryBuilder()
            .update(Configs)
            .set({
                config: () => `jsonb_set(config, '{${key}}', '${value}', true)`,
            })
            .where("guild_id = :guildId", { guildId })
            .execute();
    }
}
