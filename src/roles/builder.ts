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
		const target = Game.getObjectById<ConstructionSite>(creep.memory.energyDropOffId);
        return creep.build(target);
	}

	moveToTryBuild(creep: Creep): void {
		if (this.tryBuild(creep) == ERR_NOT_IN_RANGE) {
			const target = Game.getObjectById<ConstructionSite>(creep.memory.energyDropOffId);
			this.moveTo(creep, target, "#000000");
		}
	}

	public action(creep: Creep): boolean {
		if (super.action(creep)){
			return;
		}

		if (this.isBagFull(creep) || creep.memory["buildInProgress"]) {
			creep.memory["buildInProgress"] = true;
			this.moveToTryBuild(creep);

			// reset buildInProgress if bag is empty!
			if (this.isBagEmpty(creep)) {
				creep.memory["buildInProgress"] = false;
			}
		} else {
			this.moveToEnergySource(creep);
		}

		return true;
	}
}
