import { CreepManager } from "managers/creep-manager";
import { SourceManager } from "managers/sources-manager";
import { CreepBaseInterface } from "./creep-base";
import { CreepPickupBase } from "./creep-pickup-base";

export interface BuilderInterface {
	tryBuild(creep: Creep): number;
	moveToTryBuild(creep: Creep): void

	action(creep: Creep): boolean;
}

export class Builder extends CreepPickupBase implements BuilderInterface, CreepBaseInterface {
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
			this.moveToEnergySource(creep);
		}

		return true;
	}
}
