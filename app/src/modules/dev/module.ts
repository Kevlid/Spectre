import { Module } from "@/types/module";

import { CleanDatabasePrefix } from "./prefix/clean-database";
import { CleanPrefix } from "./prefix/clean";
import { DeleteManyPrefix } from "./prefix/delete-many";
import { RandomColorPrefix } from "./prefix/random-color";
import { UpdatePrefix } from "./prefix/update";
import { SetStatusPrefix } from "./prefix/set-status";
import { TriggerJoinPrefix } from "./prefix/trigger-join";

export const DevModule: Module = {
	id: "dev",
	developerOnly: true,
	prefixCommands: [
		CleanDatabasePrefix,
		CleanPrefix,
		DeleteManyPrefix,
		RandomColorPrefix,
		UpdatePrefix,
		SetStatusPrefix,
		TriggerJoinPrefix,
	],
};
