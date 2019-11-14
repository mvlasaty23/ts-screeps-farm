import { CreepBaseInterface } from "./creep-base";
import { CreepPickupBase } from "./creep-pickup-base";

export interface UpgraderInterface {
	tryEnergyDropOff(creep: Creep): void;
	moveToEnergyDropOff(creep: Creep): void

	action(creep: Creep): boolean;
}

export class Upgrader extends CreepPickupBase implements UpgraderInterface, CreepBaseInterface {
	tryEnergyDropOff(creep: Creep): number {
		creep.say("🔋");
		const target = Game.getObjectById<Controller>(creep.memory.energyDropOffId);
		return creep.upgradeController(target);
	}

	moveToEnergyDropOff(creep: Creep): void {
		if (this.tryEnergyDropOff(creep) == ERR_NOT_IN_RANGE) {
			const target = Game.getObjectById<Controller>(creep.memory.energyDropOffId);
			this.moveTo(creep, target, '#FFD700');
		}
	}

	public action(creep: Creep): boolean {
		if (super.action(creep)){
			return;
		}

		if (this.isBagFull(creep) || creep.memory.unloadInProgress) {
			creep.memory.unloadInProgress = true;
			this.moveToEnergyDropOff(creep);

			// reset unloadInProgress if bag is empty!
			if (this.isBagEmpty(creep)) {
				creep.memory.unloadInProgress = false;
			}
		} else {
			this.moveToEnergySource(creep);
		}

		return true
	}
}
