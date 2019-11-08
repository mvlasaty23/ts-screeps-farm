import { SourceManager } from "sources/sources-manager";
import { SpawnManager } from "spawns/spawn-manager";
import { Config } from "config/config";
import { Harvester } from "./harvester";
import { Roles } from "enums/Roles";
import { CreepManager } from "./creep-manager";

export namespace HarvesterManager {

	export function isHarvesterLimitFull(): boolean {
		var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == Roles.Harvester);
		/**
		 * This should have some kind of load balancing. It's not useful to create all the harvesters for all source points at the start.
		 */
		//return ((SourceManager.sourceCount * Config.MAX_HARVESTERS_PER_SOURCE) == this.creepCount);
		return (creeps.length >= Config.MAX_HARVESTERS);
		// return false;
	}

	export function createHarvester(): number {
		// MOVE = 50
		// CARRY = 50
		// WORK = 100
		// 50 + 50 + 50 + 50 + 50 + 100 + 100 + 100 = 550
		let bodyParts: string[] = [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK];
		let name: string = Roles.Harvester + "_" + Game.time;
		let properties: any = { memory: {
			role: Roles.Harvester,
			targetSourceId: SourceManager.getFirstSource().id,
			targetEnergyDropoffId: SpawnManager.getFirstSpawn().id,
			renew_station_id: SpawnManager.getFirstSpawn().id
		}};
		var status: number = SpawnManager.getFirstSpawn().spawnCreep(bodyParts, name, { dryRun: true });
		if (status == OK) {
			SpawnManager.getFirstSpawn().spawnCreep(bodyParts, name, properties);

			console.log("Started creating new Harvester");
		}

		return status;
	}

	export function harvestersGoToWork(): void {
		let harvesters: Harvester[] = [];
		let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == Roles.Harvester);
		_.forEach(creeps, function(creep: Creep) {
			if (creep.memory.role == Roles.Harvester) {
				// check if creep is marked for recycle
				if (CreepManager.isCreepMarkedForRecycle(creep)) {
					CreepManager.recycleCreep(creep);
				} else {
					let harvester = new Harvester();
					harvester.setCreep(creep);
					// Next move for harvester
					harvester.action();

					// Save harvester to collection
					harvesters.push(harvester);
				}
			}
		});

		if (Config.VERBOSE) {
			console.log(harvesters.length + " harvesters reported on duty today!");
		}
	}
}
