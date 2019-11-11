import { RoomManager } from "managers/room-manager";
import { CreepBaseInterface } from "./creep-base";
import { CreepPickupBase } from "./creep-pickup-base";
import { CreepManager } from "managers/creep-manager";

export interface UpgraderInterface {
	tryPickup(creep: Creep): number;
	moveToTryPickup(creep: Creep): void;
	tryEnergyDropOff(creep: Creep): void;
	moveToEnergyDropOff(creep: Creep): void

	action(creep: Creep): boolean;
}

export class Upgrader extends CreepPickupBase implements UpgraderInterface, CreepBaseInterface {
	tryEnergyDropOff(creep: Creep): number {
		creep.say("🔋");
		return creep.upgradeController(RoomManager.getFirstRoom().controller);
	}

	moveToEnergyDropOff(creep: Creep): void {
		if (this.tryEnergyDropOff(creep) == ERR_NOT_IN_RANGE) {
			this.moveTo(creep, RoomManager.getFirstRoom().controller, '#FFD700');
		}
	}

	public action(creep: Creep): boolean {
		if (super.action(creep)){
			return;
		}

		if (CreepManager.isBagFull(creep) || creep.memory.unloadInProgress) {
			creep.memory.unloadInProgress = true;
			this.moveToEnergyDropOff(creep);

			// reset unloadInProgress if bag is empty!
			if (CreepManager.isBagEmpty(creep)) {
				creep.memory.unloadInProgress = false;
			}
		} else {
			this.moveToEnergySource(creep);
		}

		return true
	}
}
