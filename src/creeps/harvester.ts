import { CreepActionInterface, CreepAction } from "./creep-action";
import { SpawnManager } from "spawns/spawn-manager";

export interface HarvesterInterface {

	targetSource: Source;
	targetEnergyDropOff: Spawn|Structure;

	isBagFull(): boolean;
	tryHarvest(): number;
	moveToHarvest(): void;
	tryEnergyDropOff(): number;
	moveToDropEnergy(): void;

	action(): boolean;
}

export class Harvester extends CreepAction implements HarvesterInterface, CreepActionInterface {

	public targetSource: Source = null;
	public targetEnergyDropOff: Spawn|Structure = null;

	public setCreep(creep: Creep) {
		super.setCreep(creep);

		if (!this.creep.memory.targetEnergyDropoffId) {
			this.creep.memory.targetEnergyDropoffId = SpawnManager.getFirstSpawn().id;
		}
		if (!this.creep.memory.renew_station_id) {
			this.creep.memory.renew_station_id = SpawnManager.getFirstSpawn().id;
		}
		// this.targetSource = <Source>Game.getObjectById(this.creep.memory.targetSourceId);
		this.targetSource = Game.getObjectById("5bbcaeb89099fc012e639753");
		this.targetEnergyDropOff = <Spawn|Structure>Game.getObjectById(this.creep.memory.targetEnergyDropoffId);

		// first fill spawn
		if (this.targetEnergyDropOff["store"].getFreeCapacity(RESOURCE_ENERGY) === 0) {

			// then fill extensions
			let extensions: Structure[] = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION) &&
						structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
				}
			});

			if (extensions.length){
				this.targetEnergyDropOff = extensions[0];
			} else {
				// then fill all other targets
				let targets: Structure[] = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_SPAWN ||
							structure.structureType == STRUCTURE_TOWER ||
							structure.structureType == STRUCTURE_CONTAINER) &&
							structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
					}
				});
				this.targetEnergyDropOff = targets[0];
			}
		}
	}

	public isBagEmpty(): boolean {
		return (this.creep.carry.energy == 0);
	}

	public isBagFull(): boolean {
		return (this.creep.carry.energy == this.creep.carryCapacity);
	}

	public tryHarvest(): number {
		return this.creep.harvest(this.targetSource);
	}

	public moveToHarvest(): void {
		if (this.tryHarvest() == ERR_NOT_IN_RANGE) {
			this.moveTo(this.targetSource, "#B22222");
		}
	}

	public tryEnergyDropOff(): number {
		return this.creep.transfer(this.targetEnergyDropOff, RESOURCE_ENERGY);
	}

	public moveToDropEnergy(): void {
		if (this.tryEnergyDropOff() == ERR_NOT_IN_RANGE) {
			this.moveTo(this.targetEnergyDropOff, "#FFD700");
		}
	}

	public action(): boolean {
		if (this.needsRenew()) {
			this.moveToRenew();
		} else if (this.isBagFull() || this.creep.memory.unloadInProgress) {
			this.creep.memory.unloadInProgress = true;
			this.moveToDropEnergy();

			// reset unloadInProgress if bag is empty!
			if (this.isBagEmpty()) {
				this.creep.memory.unloadInProgress = false;
			}
		} else {
			this.moveToHarvest();
		}

		return true
	}
}
