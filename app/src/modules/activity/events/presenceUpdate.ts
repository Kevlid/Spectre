import { GuildMember, Presence } from 'discord.js';
import { KiwiClient } from '@/client';
import { Event, EventList } from '@/types/event';

const maxStatusCount = 15;
const maxPresenceCount = 15;

/**
 * @type {Event}
 */
export const PresenceUpdate: Event = {
	name: EventList.PresenceUpdate,
	global: true,

	/**
	 * @param {KiwiClient} client
	 * @param {Presence} presence
	 */
	async execute(client: KiwiClient, presence: Presence) {
		if (presence.user.bot) return;

		var member = await presence.member.fetch();
		if (!member) return;

		var latestStatus = await client.db.repos.activityStatus.findOne({
			where: { userId: member.id },
			order: { timestamp: 'DESC' },
		});

		if (latestStatus?.name !== member.presence.status) {
			insertNewStatus(client, member);
		}

		addPresence(client, member);

		updateEndedPresence(client, member);
	},
};

async function insertNewStatus(client: KiwiClient, member: GuildMember) {
	await client.db.repos.activityStatus.insert({
		userId: member.id,
		userName: member.user.username,
		name: member.presence.status,
		timestamp: new Date(),
	});
}

async function addPresence(client: KiwiClient, member: GuildMember) {
	for (let activity of member.presence.activities) {
		if (activity.name === 'Spotify') continue;
		if (!activity?.timestamps) continue;

		var existingActivity = await client.db.repos.activityPresence.findOneBy(
			{
				userId: member.id,
				name: activity.name,
				startTimestamp: activity.timestamps.start,
			}
		);

		if (!existingActivity) {
			await client.db.repos.activityPresence.insert({
				userId: member.id,
				userName: member.user.username,
				name: activity.name,
				type: activity.type,
				startTimestamp: activity.timestamps.start,
			});
		} else if (existingActivity.endTimestamp) {
			existingActivity.endTimestamp = null;
			await client.db.repos.activityPresence.save(existingActivity);
		}
	}
}

async function updateEndedPresence(client: KiwiClient, member: GuildMember) {
	var existingActivities = await client.db.repos.activityPresence.find({
		where: { userId: member.id, endTimestamp: null },
	});

	for (let activity of existingActivities) {
		if (
			!member.presence.activities.some(
				(memberActivity) =>
					memberActivity.name === activity.name &&
					memberActivity.timestamps?.start?.getTime() ===
						activity.startTimestamp.getTime()
			)
		) {
			activity.endTimestamp = new Date();
			await client.db.repos.activityPresence.save(activity);
		}
	}
}

async function cleanUpOverflow(client: KiwiClient, member: GuildMember) {
	var statusCount = await client.db.repos.activityStatus.count({
		where: { userId: member.id },
	});

	if (statusCount >= maxStatusCount) {
		var oldestStatus = await client.db.repos.activityStatus.find({
			where: { userId: member.id },
			order: { timestamp: 'ASC' },
			take: 1,
		});
		if (oldestStatus.length > 0) {
			await client.db.repos.activityStatus.remove(oldestStatus[0]);
		}
	}

	var presenceCount = await client.db.repos.activityPresence.count({
		where: { userId: member.id },
	});

	if (presenceCount >= maxPresenceCount) {
		var oldestPresence = await client.db.repos.activityPresence.find({
			where: { userId: member.id },
			order: { startTimestamp: 'ASC' },
			take: 1,
		});
		if (oldestPresence.length > 0) {
			await client.db.repos.activityPresence.remove(oldestPresence[0]);
		}
	}
}
