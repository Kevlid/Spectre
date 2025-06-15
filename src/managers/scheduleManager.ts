import { scheduleJob } from "node-schedule";
import { KiwiClient } from "@/client";
import { Schedule } from "@/types/schedule";

export class ScheduleManager {
    private client: KiwiClient;

    constructor(client: KiwiClient) {
        this.client = client;
    }

    register(schedule: Schedule) {
        scheduleJob(schedule.rule, async () => {
            for (var guild of await this.client.guilds.fetch()) {
                if (guild[0] && schedule.module && !schedule.module?.default) {
                }
                schedule.execute(this.client, guild[0]);
            }
        });
    }
}
