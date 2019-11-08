import { SourceManager } from "sources/sources-manager";
import { SpawnManager } from "spawns/spawn-manager";
import { Config } from "config/config";
import { HarvesterContainer } from "./HarvesterContainer";
import { Roles } from "enums/Roles";
import { CreepManager } from "./creep-manager";

export namespace HarvesterContainerManager {

	export function isHarvesterContainerLimitFull(): boolean {
		let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == Roles.HarvesterContainer);
		/**
		 * This should have some kind of load balancing. It's not useful to create all the HarvesterContainers for all source points at the start.
		 */
		//return ((SourceManager.sourceCount * Config.MAX_HARVESTERCONTAINERS) == this.creepCount);
		return (creeps.length >= Config.MAX_HARVESTERCONTAINERS);
		// return false;
	}

	export function createHarvesterContainer(): number {
		// MOVE = 50
		// CARRY = 50
		// WORK = 100
		// 50 + 50 + 50 + 50 + 50 + 100 + 100 + 100 = 550
		let bodyParts: string[] = [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK];
		let name: string = Roles.HarvesterContainer + "_" + Game.time;
		let properties: any = { memory: {
			role: Roles.HarvesterContainer,
			targetSourceId: SourceManager.getFirstSource().id,
			renew_station_id: SpawnManager.getFirstSpawn().id
		}};

		let status: number = SpawnManager.getFirstSpawn().spawnCreep(bodyParts, name, { dryRun: true });
		if (status == OK) {
			SpawnManager.getFirstSpawn().spawnCreep(bodyParts, name, properties) as number;

			console.log("Started creating new HarvesterContainer");
		}

		return status;
	}

	export function harvesterContainersGoToWork(): void {
		let harvesterContainers: HarvesterContainer[] = [];
		let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == Roles.HarvesterContainer);
		_.forEach(creeps, function(creep: Creep) {
			if (creep.memory.role == Roles.HarvesterContainer) {
				// check if creep is marked for recycle
				if (CreepManager.isCreepMarkedForRecycle(creep)) {
					CreepManager.recycleCreep(creep);
				} else {
					let harvesterContainer = new HarvesterContainer();
					harvesterContainer.setCreep(creep);
					// Next move for HarvesterContainer
					harvesterContainer.action();

					// Save HarvesterContainer to collection
					harvesterContainers.push(harvesterContainer);
				}
			}
		});

		if (Config.VERBOSE) {
			console.log(harvesterContainers.length + " HarvesterContainers reported on duty today!");
		}
	}
}
