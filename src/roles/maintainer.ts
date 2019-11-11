import { SourceManager } from "managers/sources-manager";
import { CreepBaseInterface } from "./creep-base";
import { CreepPickupBase } from "./creep-pickup-base";

export interface MaintainerInterface {
	tryPickup(creep: Creep): number;
	moveToTryPickup(creep: Creep): void;
	tryMaintain(creep: Creep): void;
	moveToTryMaintain(creep: Creep): void

	action(creep: Creep): boolean;
}

export class Maintainer extends CreepPickupBase implements MaintainerInterface, CreepBaseInterface {
	tryMaintain(creep: Creep): number {
		return creep.repair(SourceManager.getNearestMaintainObject(creep.pos));
	}

	moveToTryMaintain(creep: Creep): void {
		if (this.tryMaintain(creep) == ERR_NOT_IN_RANGE) {
			this.moveTo(creep, SourceManager.getNearestMaintainObject(creep.pos), '#FFD700');
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
