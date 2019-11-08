import { SourceManager } from "sources/sources-manager";
import { SpawnManager } from "spawns/spawn-manager";
import { Config } from "config/config";
import { Upgrader } from "./upgrader";
import { Roles } from "enums/Roles";
import { CreepManager } from "./creep-manager";

export namespace UpgraderManager {

	export function isLimitFull(): boolean {
		let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == Roles.Upgrader);
		return (creeps.length >= Config.MAX_UPGRADERS);
	}

	export function createUnit(): number {
		// MOVE = 50
		// CARRY = 50
		// WORK = 100
		// 50 + 50 + 50 + 50 + 50 + 100 + 100 + 100 = 500
		let bodyParts: string[] = [MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK];
		let name: string = Roles.Upgrader + "_" + Game.time;
		let properties: any = {memory: {
			role: Roles.Upgrader,
			targetControllerId: SourceManager.getFirstController().id,
			targetSourceId: SourceManager.getFirstSource().id,
			targetContainerSourceId: SourceManager.getFirstContainer().id,
			renew_station_id: SpawnManager.getFirstSpawn().id
		}};

		let status: number = SpawnManager.getFirstSpawn().spawnCreep(bodyParts, name, { dryRun: true });
		if (status == OK) {
			SpawnManager.getFirstSpawn().spawnCreep(bodyParts, name, properties);

			console.log("Started creating new Upgrader");
		}

		return status;
	}

	export function goToWork(): void {
		let upgraders: Upgrader[] = [];
		let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == Roles.Upgrader);
		_.forEach(creeps, function(creep: Creep) {
			if (creep.memory.role ==  Roles.Upgrader) {
				// check if creep is marked for recycle
				if (CreepManager.isCreepMarkedForRecycle(creep)) {
					CreepManager.recycleCreep(creep);
				} else {
					let upgrader = new Upgrader();
					upgrader.setCreep(creep);
					// Next move for upgrader
					upgrader.action();

					// Save upgrader to collection
					upgraders.push(upgrader);
				}
			}
		});

		if (Config.VERBOSE) {
			console.log(upgraders.length + " upgraders reported on duty today!");
		}
	}
}
