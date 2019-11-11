import { CreepBase } from "./creep-base";
import { SourceManager } from "managers/sources-manager";

export interface CreepPickupBaseInterface {
	tryPickup(creep: Creep): number;
	moveToTryPickup(creep: Creep): void;
	tryWithdraw(creep: Creep, structureContainer: StructureContainer): number;
	moveToTryWithdraw(creep: Creep, structureContainer: StructureContainer): void;
	moveToEnergySource(creep: Creep): void;
}

export class CreepPickupBase extends CreepBase implements CreepPickupBaseInterface {
	tryPickup(creep: Creep): number {
		const target = creep.pos.findClosestByRange<Resource>(106); // FIND_DROPPED_ENERGY
		return creep.pickup(target);
		// return creep.withdraw(SourceManager.getNearestContainer(creep.pos), RESOURCE_ENERGY);
	}

	moveToTryPickup(creep: Creep): void {
		if (this.tryPickup(creep) == ERR_NOT_IN_RANGE) {
			const target = creep.pos.findClosestByRange<Resource>(106); // FIND_DROPPED_ENERGY
			this.moveTo(creep, target, "#B22222");
			// this.moveTo(creep, SourceManager.getNearestContainer(creep.pos), "#B22222");
		}
	}

	tryWithdraw(creep: Creep, structureContainer: StructureContainer): number {
		return creep.withdraw(structureContainer, RESOURCE_ENERGY);
	}

	moveToTryWithdraw(creep: Creep, structureContainer: StructureContainer): void {
		var result = this.tryWithdraw(creep, structureContainer);
		if (result == ERR_NOT_IN_RANGE) {
			this.moveTo(creep, structureContainer, "#B22222");
		}
	}

	moveToEnergySource(creep: Creep): void {
		let nearestSource = SourceManager.getNearestContainer(creep.pos);
		if (nearestSource && nearestSource.store.getUsedCapacity() > 50){
			this.moveToTryWithdraw(creep, nearestSource);
		} else {
			this.moveToTryPickup(creep);
		}
	}
}
