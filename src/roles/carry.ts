import { SpawnManager } from "managers/spawn-manager";
import { CreepBaseInterface } from "./creep-base";
import { CreepPickupBase } from "./creep-pickup-base";
import { CreepManager } from "managers/creep-manager";

export interface CarryInterface {
	tryPickup(creep: Creep): number;
	moveToTryPickup(creep: Creep): void;
	tryEnergyDropOff(creep: Creep): void;
	moveToEnergyDropOff(creep: Creep): void

	action(creep: Creep): boolean;
}

export class Carry extends CreepPickupBase implements CarryInterface, CreepBaseInterface {
	tryEnergyDropOff(creep: Creep): number {
		creep.say("🔋");
		return creep.transfer(this.getEnergyDropOff(creep), RESOURCE_ENERGY);
	}

	moveToEnergyDropOff(creep: Creep): void {
		if (this.tryEnergyDropOff(creep) == ERR_NOT_IN_RANGE) {
			this.moveTo(creep, this.getEnergyDropOff(creep), '#FFD700');
		}
	}

	private getEnergyDropOff(creep: Creep): Structure {
		let result: Structure = SpawnManager.getFirstSpawn();

		// first fill spawn
		if (result["store"].getFreeCapacity(RESOURCE_ENERGY) === 0) {

			// then fill extensions
			let extension = creep.pos.findClosestByRange<Structure>(FIND_STRUCTURES, {
				filter: (structure: Structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION) &&
						structure["store"].getFreeCapacity(RESOURCE_ENERGY) > 0;
				}
			});

			if (extension){
				result = extension;
			} else {
				// then fill all other targets
				let target: Structure = creep.pos.findClosestByRange<Structure>(FIND_STRUCTURES, {
					filter: (structure: Structure) => {
						return (structure.structureType == STRUCTURE_TOWER) &&
							structure["store"].getFreeCapacity(RESOURCE_ENERGY) > 0;
					}
				});
				result = target;
			}
		}

		return result;
	}

	public action(creep: Creep): boolean {
		if (super.action(creep)){
			return;
		}

		if (CreepManager.isBagFull(creep) || creep.memory["unloadInProgress"]) {
			creep.memory["unloadInProgress"] = true;
			this.moveToEnergyDropOff(creep);

			// reset unloadInProgress if bag is empty!
			if (CreepManager.isBagEmpty(creep)) {
				creep.memory["unloadInProgress"] = false;
			}
		} else {
			this.moveToEnergySource(creep);
		}

		return true;
	}
}
