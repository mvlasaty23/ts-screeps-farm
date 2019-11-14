import { CreepBase } from "./creep-base";

export interface CreepPickupBaseInterface {
	setEnergyPickupIds(creep: Creep): void;
	moveToTryGetEnergy(creep: Creep): void;
	tryGetEnergy(creep: Creep): number;
	moveToEnergySource(creep: Creep): void;
}

export class CreepPickupBase extends CreepBase implements CreepPickupBaseInterface {

	moveToTryGetEnergy(creep: Creep): void {
		const result = this.tryGetEnergy(creep);
		if (result == ERR_NOT_IN_RANGE) {
			const structure = Game.getObjectById<Resource | Structure>(creep.memory.energyPickupId);
			this.moveTo(creep, structure, "#B22222");
		}
	}

	tryGetEnergy(creep: Creep): number {
		const target = Game.getObjectById<Resource | Structure>(creep.memory.energyPickupId);
		if (target instanceof Structure) {
			if (target.structureType == STRUCTURE_CONTAINER) {
				if ((target as StructureContainer).store.getUsedCapacity() < 50) {
					this.setEnergyPickupIds(creep);
				}
			}
			return creep.withdraw(target, RESOURCE_ENERGY);
		} else if (target instanceof Resource) {
			return creep.pickup(target);
		}
	}

	moveToEnergySource(creep: Creep): void {
		this.moveToTryGetEnergy(creep);
	}
}
