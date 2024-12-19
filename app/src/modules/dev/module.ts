import { Module } from "@/types/module";

import { CleanDatabasePrefix } from "./prefix/clean-database";
import { CleanPrefix } from "./prefix/clean";
import { DeleteManyPrefix } from "./prefix/delete-many";
import { RandomColorPrefix } from "./prefix/random-color";
import { SetStatusPrefix } from "./prefix/set-status";
import { TimeoutPrefix } from "./prefix/timeout";
import { TriggerJoinPrefix } from "./prefix/trigger-join";
import { UpdatePrefix } from "./prefix/update";

export const DevModule: Module = {
	id: "dev",
	developerOnly: true,
	prefixCommands: [
		CleanDatabasePrefix,
		CleanPrefix,
		DeleteManyPrefix,
		RandomColorPrefix,
		SetStatusPrefix,
		TimeoutPrefix,
		TriggerJoinPrefix,
		UpdatePrefix,
	],
};
