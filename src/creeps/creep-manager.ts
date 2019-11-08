import { Config } from "./../config/config";
import { BuilderManager } from "./builder-manager";
import { HarvesterManager } from "./harvester-manager";
import { HarvesterContainerManager } from "./harvesterContainer-manager";
import { UpgraderManager } from "./upgrader-manager";
import { SpawnManager } from "spawns/spawn-manager";

export namespace CreepManager {

	export var creeps: Creep[] = null;
	export var creepNames: string[] = [];
	export var creepCount: number = 0;

	export function loadCreeps(): void {
		this.creeps = Game.creeps;
		this.creepCount = _.size(this.creeps);

		_loadCreepNames();

		if (Config.VERBOSE) {
			console.log(this.creepCount + " creeps found in the playground.");
		}
	}

	function _loadCreepNames(): void {
		for (let creepName in creeps) {
			if (creeps.hasOwnProperty(creepName)) {
				creepNames.push(creepName);
			}
		}
	}

	export function recycleCreep(creep: Creep) {
		if (SpawnManager.getFirstSpawn().recycleCreep(creep) == ERR_NOT_IN_RANGE) {
			creep.moveTo(SpawnManager.getFirstSpawn(), {visualizePathStyle: {stroke: '#FF0000'}});
			creep.say("⚰️");
		}
	}

	export function isCreepMarkedForRecycle(creep: Creep): boolean {
		let creepIdToRecycle = ["5dc5a0b7fa518db60fd60b80", "5dc5a1159a5685b4d2b7e063"];
		if (creepIdToRecycle.indexOf(creep.id) > -1) {
			return true;
		}
		return false;
	}

	export function startManageCreeps(): void {
		// Harvester
		if (!HarvesterManager.isHarvesterLimitFull()) {
			HarvesterManager.createHarvester();

			if (Config.VERBOSE) {
				console.log("Need more harvesters!");
			}
		}
		HarvesterManager.harvestersGoToWork();

		// Upgrader
		if (!UpgraderManager.isLimitFull()) {
			UpgraderManager.createUnit();

			if (Config.VERBOSE) {
				console.log("Need more upgraders!");
			}
		}
		UpgraderManager.goToWork();

		// HarvesterContainer
		if (!HarvesterContainerManager.isHarvesterContainerLimitFull()) {
			HarvesterContainerManager.createHarvesterContainer();

			if (Config.VERBOSE) {
				console.log("Need more harvesterContainer!");
			}
		}
		HarvesterContainerManager.harvesterContainersGoToWork();


		// Builder
		if (!BuilderManager.isLimitFull()) {
			BuilderManager.createUnit();

			if (Config.VERBOSE) {
				console.log("Need more builders!");
			}
		}
		BuilderManager.goToWork();
	}
}
