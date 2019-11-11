import { Roles } from "enums/Roles";
import { BodyBuilder } from "helper/body-builder";
import { Builder } from "roles/builder";
import { Carry } from "roles/carry";
import { Maintainer } from "roles/maintainer";
import { Miner } from "roles/miner";
import { Upgrader } from "roles/upgrader";
import { ConfigManager, IConfig } from "./config-manager";
import { SpawnManager } from "./spawn-manager";

export namespace CreepManager {
	export function getMinerCreeps(): Creep[] {
		return _.filter(Game.creeps, (creep) => creep.memory.role == Roles.Miner);
	}

	export function getCarryCreeps(): Creep[] {
		return _.filter(Game.creeps, (creep) => creep.memory.role == Roles.Carry);
	}

	export function getBuilderCreeps(): Creep[] {
		return _.filter(Game.creeps, (creep) => creep.memory.role == Roles.Builder);
	}

	export function getUpgraderCreeps(): Creep[] {
		return _.filter(Game.creeps, (creep) => creep.memory.role == Roles.Upgrader);
	}

	export function getMaintainerCreeps(): Creep[] {
		return _.filter(Game.creeps, (creep) => creep.memory.role == Roles.Maintainer);
	}

	export function run() {
		spawnCreeps();
		startWork();

	}

	function startWork() {
		startWorkMiners();
		startWorkCarrys();
		startWorkUpgraders();
		startWorkBuilders();
		startWorkMaintainers();
	}

	function startWorkMiners() {
		getMinerCreeps().forEach(miner => {
			new Miner().action(miner);
		});
	}

	function startWorkCarrys() {
		getCarryCreeps().forEach(carry => {
			new Carry().action(carry);
		});
	}

	function startWorkUpgraders() {
		getUpgraderCreeps().forEach(upgrader => {
			new Upgrader().action(upgrader);
		});
	}

	function startWorkBuilders() {
		getBuilderCreeps().forEach(builder => {
			new Builder().action(builder);
		});
	}

	function startWorkMaintainers() {
		getMaintainerCreeps().forEach(maintainer => {
			new Maintainer().action(maintainer);
		});
	}

	function spawnCreeps() {
		let config = ConfigManager.getConfig();
		if (spawnMiner(config)) {
			return;
		}
		if (spawnCarry(config)) {
			return;
		}
		if (spawnBuilder(config)) {
			return;
		}
		if (spawnUpgrader(config)) {
			return;
		}
		if (spawnMaintainer(config)) {
			return;
		}
	}

	function spawnMiner(config: IConfig): boolean {
		if (getMinerCreeps().length < config.MAX_MINERS) {
			const minerBody = BodyBuilder.generateBody({primaryPart: WORK, secondaryPart: MOVE, ratio: config.MINER_RATIO});
			const name = Roles.Miner + Game.time;

			return spawnCreep(minerBody, name, Roles.Miner);
		}
		return false;
	}

	function spawnCarry(config: IConfig): boolean {
		if (getCarryCreeps().length < config.MAX_CARRYS) {
			const carryBody = BodyBuilder.generateBody({primaryPart: CARRY, secondaryPart: MOVE, ratio: config.CARRY_RATIO});
			const name = Roles.Carry + Game.time;

			return spawnCreep(carryBody, name, Roles.Carry);
		}
		return false;
	}

	function spawnBuilder(config: IConfig): boolean {
		if (getBuilderCreeps().length < config.MAX_BUILDERS) {
			const builderBody = BodyBuilder.generateBody({primaryPart: WORK, secondaryPart: MOVE, thirdPart: CARRY, ratio: config.BUILDER_RATIO});
			const name = Roles.Builder + Game.time;

			return spawnCreep(builderBody, name, Roles.Builder);
		}
		return false;
	}

	function spawnUpgrader(config: IConfig): boolean {
		if (getUpgraderCreeps().length < config.MAX_UPGRADERS) {
			const upgraderBody = BodyBuilder.generateBody({primaryPart: WORK, secondaryPart: MOVE, thirdPart: CARRY, ratio: config.UPGRADER_RATIO});
			const name = Roles.Upgrader + Game.time;

			return spawnCreep(upgraderBody, name, Roles.Upgrader);
		}
		return false;
	}

	function spawnMaintainer(config: IConfig): boolean {
		if (getMaintainerCreeps().length < config.MAX_MAINTAINERS) {
			const maintainerBody = BodyBuilder.generateBody({primaryPart: WORK, secondaryPart: MOVE, thirdPart: CARRY, ratio: config.MAINTAINTER_RATIO});
			const name = Roles.Maintainer + Game.time;

			return spawnCreep(maintainerBody, name, Roles.Maintainer);
		}
		return false;
	}

	function spawnCreep(body: string[], name: string, role: string): boolean {
		var status: number = SpawnManager.getFirstSpawn().spawnCreep(body, name, { dryRun: true });
		console.log(status, role, body);
		if (status == OK) {
			SpawnManager.getFirstSpawn().spawnCreep(body, name, {
				memory: {
					role: role
				}
			});

			console.log(name + " spawned! (" + body + ")");
			return true;
		}
		return false;
	}

	export function isBagEmpty(creep: Creep): boolean {
		return (creep.carry.energy == 0);
	}

	export function isBagFull(creep: Creep): boolean {
		return (creep.carry.energy == creep.carryCapacity);
	}

	export function getNearestCreepToHeal(pos: RoomPosition): Creep {
		let result = pos.findClosestByRange<Creep>(FIND_CREEPS, {
			filter: (object: Creep) => (object.hits < object.hitsMax)
		});
		return result;
	}
}
