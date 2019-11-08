import { Config } from "config/config";
import { Roles } from "enums/Roles";
import { SourceManager } from "sources/sources-manager";
import { SpawnManager } from "spawns/spawn-manager";
import { Builder } from "./builder";
import { CreepManager } from "./creep-manager";

export namespace BuilderManager {

	export function isLimitFull(): boolean {
		var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == Roles.Builder);
		return (creeps.length >= Config.MAX_BUILDERS);
	}

	export function createUnit(): number {
		// MOVE = 50
		// CARRY = 50
		// WORK = 100
		// 50 + 50 + 50 + 50 + 50 + 100 + 100 + 100 = 550
		let bodyParts: string[] = [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK];
		let name: string = Roles.Builder + "_" + Game.time;
		let properties: any = { memory: {
			role: Roles.Builder,
			energySourceId: SourceManager.getFirstSource().id,
			renew_station_id: SpawnManager.getFirstSpawn().id
		}};

		var status: number = SpawnManager.getFirstSpawn().spawnCreep(bodyParts, name, { dryRun: true });
		if (status == OK) {
			SpawnManager.getFirstSpawn().spawnCreep(bodyParts, name, properties) as number;

			console.log("Started creating new Builder");
		}

		return status;
	}

	export function goToWork(): void {
		let builders: Builder[] = [];
		let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == Roles.Builder);
		_.forEach(creeps, function(creep: Creep) {
			if (creep.memory.role ==  Roles.Builder) {
				// check if creep is marked for recycle
				if (CreepManager.isCreepMarkedForRecycle(creep)) {
					CreepManager.recycleCreep(creep);
				} else {
					let builder = new Builder();
					builder.setCreep(creep);
					// Next move for builder
					builder.action();

					// Save builder to collection
					builders.push(builder);
				}
			}
		});

		if (Config.VERBOSE) {
			console.log(builders.length + " builders reported on duty today!");
		}
	}
}
