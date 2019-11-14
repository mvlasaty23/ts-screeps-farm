import { CreepBaseInterface } from "./creep-base";
import { CreepPickupBase } from "./creep-pickup-base";

export interface MaintainerInterface {
	tryMaintain(creep: Creep): void;
	moveToTryMaintain(creep: Creep): void

	action(creep: Creep): boolean;
}

export class Maintainer extends CreepPickupBase implements MaintainerInterface, CreepBaseInterface {
	tryMaintain(creep: Creep): number {
		const target = Game.getObjectById<Structure>(creep.memory.energyDropOffId);
		return creep.repair(target);
	}

	moveToTryMaintain(creep: Creep): void {
		if (this.tryMaintain(creep) == ERR_NOT_IN_RANGE) {
			const target = Game.getObjectById<Structure>(creep.memory.energyDropOffId);
			this.moveTo(creep, target, '#FFD700');
		}
	}

	public action(creep: Creep): boolean {
		if (super.action(creep)){
			return;
		}

		if (this.isBagFull(creep) || creep.memory["unloadInProgress"]) {
			creep.memory["unloadInProgress"] = true;
			this.moveToTryMaintain(creep);

			// reset unloadInProgress if bag is empty!
			if (this.isBagEmpty(creep)) {
				creep.memory["unloadInProgress"] = false;
			}
		} else {
			this.moveToEnergySource(creep);
		}

		return true
	}
}
