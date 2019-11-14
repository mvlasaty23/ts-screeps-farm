import { CreepBaseInterface } from "./creep-base";
import { CreepPickupBase } from "./creep-pickup-base";

export interface CarryInterface {
	tryEnergyDropOff(creep: Creep): void;
	moveToEnergyDropOff(creep: Creep): void

	action(creep: Creep): boolean;
}

export class Carry extends CreepPickupBase implements CarryInterface, CreepBaseInterface {
	tryEnergyDropOff(creep: Creep): number {
		creep.say("🔋");
		const target = Game.getObjectById<Structure>(creep.memory.energyDropOffId);
		return creep.transfer(target, RESOURCE_ENERGY);
	}

	moveToEnergyDropOff(creep: Creep): void {
		if (this.tryEnergyDropOff(creep) == ERR_NOT_IN_RANGE) {
			const target = Game.getObjectById<Structure>(creep.memory.energyDropOffId);
			this.moveTo(creep, target, '#FFD700');
		}
	}

	public action(creep: Creep): boolean {
		if (super.action(creep)){
			return;
		}

		if (this.isBagFull(creep) || this.getBagUsedCapacity(creep) > 400 || creep.memory.unloadInProgress) {
			creep.memory.unloadInProgress = true;
			this.moveToEnergyDropOff(creep);

			// reset unloadInProgress if bag is empty!
			if (this.isBagEmpty(creep)) {
				creep.memory.unloadInProgress = false;
			}
		} else {
			this.moveToEnergySource(creep);
		}

		return true;
	}
}
