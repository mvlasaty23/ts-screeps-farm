import { CreepManager } from "managers/creep-manager";
import { SourceManager } from "managers/sources-manager";
import { CreepBase, CreepBaseInterface } from "./creep-base";

export interface BuilderInterface {
	tryPickupEnergy(creep: Creep): number;
	movePickupEnergy(creep: Creep): void;
	tryBuild(creep: Creep): number;
	moveToTryBuild(creep: Creep): void

	action(creep: Creep): boolean;
}

export class Builder extends CreepBase implements BuilderInterface, CreepBaseInterface {
	tryPickupEnergy(creep: Creep): number {
		const target = creep.pos.findClosestByRange<Resource>(106); // FIND_DROPPED_ENERGY
		return creep.pickup(target);
	}

	movePickupEnergy(creep: Creep): void {
		if (this.tryPickupEnergy(creep) == ERR_NOT_IN_RANGE) {
			const target = creep.pos.findClosestByRange<Resource>(106); // FIND_DROPPED_ENERGY
			this.moveTo(creep, target, "#B22222");
		}
	}

	tryBuild(creep: Creep): number {
		creep.say('🐌');
		const target = SourceManager.getNearestConstructionSite(creep.pos);
        return creep.build(target);
	}

	moveToTryBuild(creep: Creep): void {
		if (this.tryBuild(creep) == ERR_NOT_IN_RANGE) {
			const target = SourceManager.getNearestConstructionSite(creep.pos);
			this.moveTo(creep, target, "#000000");
		}
	}

	public action(creep: Creep): boolean {
		if (super.action(creep)){
			return;
		}

		if (CreepManager.isBagFull(creep) || creep.memory.buildInProgress) {
			creep.memory.buildInProgress = true;
			this.moveToTryBuild(creep);

			// reset buildInProgress if bag is empty!
			if (CreepManager.isBagEmpty(creep)) {
				creep.memory.buildInProgress = false;
			}
		} else {
			this.movePickupEnergy(creep);
		}

		return true;
	}
}
