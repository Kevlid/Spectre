import { DataSource, Repository } from 'typeorm';
import { KiwiClient } from '../client';

import { dataSource } from '../datasource';

import { ActivityConfigEntity } from '../entities/ActivityConfig';
import { ActivityMessageEntity } from '../entities/ActivityMessage';
import { ActivityStatusEntity } from '../entities/ActivityStatus';
import { ActivityVoiceEntity } from '../entities/ActivityVoice';
import { ActivityVoicestateEntity } from '../entities/ActivityVoicestate';
import { GuildModuleEntity } from '../entities/GuildModule';
import { ListConfigEntity } from '../entities/ListConfig';
import { MemberLevelEntity } from '../entities/MemberLevel';

export class DatabaseManager {
	public dataSource: DataSource;
	public client: KiwiClient;
	public repos: {
		activityConfig: Repository<ActivityConfigEntity>;
		activityMessages: Repository<ActivityMessageEntity>;
		activityStatus: Repository<ActivityStatusEntity>;
		activityVoice: Repository<ActivityVoiceEntity>;
		activityVoicestates: Repository<ActivityVoicestateEntity>;
		guildModules: Repository<GuildModuleEntity>;
		listConfig: Repository<ListConfigEntity>;
		memberLevels: Repository<MemberLevelEntity>;
	};

	constructor(client: KiwiClient) {
		this.client = client;
		this.dataSource = dataSource;

		this.onCreate();
	}

	private async onCreate() {
		this.repos = {
			activityConfig: await this.dataSource.getRepository(
				ActivityConfigEntity
			),
			activityMessages: await this.dataSource.getRepository(
				ActivityMessageEntity
			),
			activityStatus: await this.dataSource.getRepository(
				ActivityStatusEntity
			),
			activityVoice: await this.dataSource.getRepository(
				ActivityVoiceEntity
			),
			activityVoicestates: await this.dataSource.getRepository(
				ActivityVoicestateEntity
			),
			guildModules: await this.dataSource.getRepository(
				GuildModuleEntity
			),
			listConfig: await this.dataSource.getRepository(ListConfigEntity),
			memberLevels: await this.dataSource.getRepository(
				MemberLevelEntity
			),
		};
	}

	public async generateConfigs(guildId: string) {
		var activityConfig = await this.repos.activityConfig.findOne({
			where: { guildId },
		});
		if (!activityConfig) {
			let actConf = new ActivityConfigEntity();
			actConf.guildId = guildId;
			await this.repos.activityConfig.save(actConf);
		}

		var listConfig = await this.repos.listConfig.findOne({
			where: { guildId },
		});
		if (!listConfig) {
			let listConf = new ListConfigEntity();
			listConf.guildId = guildId;
			await this.repos.listConfig.save(listConf);
		}
	}

	public async isModuleEnabled(guildId: string, moduleId: string) {
		return await this.repos.guildModules.findOneBy({ guildId, moduleId });
	}
}
