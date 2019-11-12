import { SourceManager } from "./sources-manager";
import { SpawnManager } from "./spawn-manager";
import { RoomManager } from "./room-manager";
import { Config } from "config/config";

export interface IConfig {
	MAX_MINERS: number;
	MAX_CARRYS: number;
	MAX_BUILDERS: number;
	MAX_UPGRADERS: number;
	MAX_MAINTAINERS: number;
	MINER_RATIO: number;
	CARRY_RATIO: number;
	BUILDER_RATIO: number;
	UPGRADER_RATIO: number;
	MAINTAINTER_RATIO: number;
}

export namespace ConfigManager {
	// export let MAX_MINERS: number = 2;
	// export let MAX_CARRYS: number = 1;
	// export let MAX_BUILDERS: number = 3;
	// export let MAX_UPGRADERS: number = 1;
	// export let MAX_MAINTAINERS: number = 0;

	export function getConfig(): IConfig {
		let config: IConfig;
		let configLvl: number = 0;
		const extensionCount = SpawnManager.getExtensionsLength();
		if (SourceManager.getFirstController().level == 4 || extensionCount >= 15){
			configLvl = 4;
			config = { MAX_MINERS: 3,
				MAX_CARRYS: 2,
				MAX_BUILDERS: 1,
				MAX_UPGRADERS: 4,
				MAX_MAINTAINERS: 0,
				MINER_RATIO: 3,
				CARRY_RATIO: 3,
				BUILDER_RATIO: 3,
				UPGRADER_RATIO: 3,
				MAINTAINTER_RATIO: 3
			}
			if (Config.VERBOSE) {
				console.log("Config level: " + configLvl);
			}
			return config;
		}
		if (SourceManager.getFirstController().level == 3 || extensionCount >= 10){
			configLvl = 3;
			config = { MAX_MINERS: 2,
				MAX_CARRYS: 1,
				MAX_BUILDERS: 3,
				MAX_UPGRADERS: 4,
				MAX_MAINTAINERS: 1,
				MINER_RATIO: 3,
				CARRY_RATIO: 3,
				BUILDER_RATIO: 3,
				UPGRADER_RATIO: 3,
				MAINTAINTER_RATIO: 3
			}
			if (Config.VERBOSE) {
				console.log("Config level: " + configLvl);
			}
			return config;
		}
		if (SourceManager.getFirstController().level == 2 || extensionCount >= 5){
			configLvl = 2;
			config = { MAX_MINERS: 2,
				MAX_CARRYS: 1,
				MAX_BUILDERS: 2,
				MAX_UPGRADERS: 4,
				MAX_MAINTAINERS: 1,
				MINER_RATIO: 2,
				CARRY_RATIO: 2,
				BUILDER_RATIO: 2,
				UPGRADER_RATIO: 2,
				MAINTAINTER_RATIO: 2
			}
			if (Config.VERBOSE) {
				console.log("Config level: " + configLvl);
			}
			return config;
		}
		if (SourceManager.getFirstController().level == 1 || extensionCount < 5){
			configLvl = 1;
			config = { MAX_MINERS: 2,
				MAX_CARRYS: 1,
				MAX_BUILDERS: 2,
				MAX_UPGRADERS: 2,
				MAX_MAINTAINERS: 0,
				MINER_RATIO: 1,
				CARRY_RATIO: 1,
				BUILDER_RATIO: 1,
				UPGRADER_RATIO: 1,
				MAINTAINTER_RATIO: 1
			}
			if (Config.VERBOSE) {
				console.log("Config level: " + configLvl);
			}
			return config;
		}

		return config;
	}

	export function getNeedetExtensionsCount(): number {
		let extensionCount = 0;
		const lvl = RoomManager.getFirstRoom().controller.level;
		switch(lvl) {
			case 2:
				extensionCount = 5;
				break;
			case 3:
				extensionCount = 10;
				break;
			default:
				extensionCount = (lvl - 2) * 10;
				break;
		}
		return extensionCount;
	}
}
