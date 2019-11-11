import { CreepBase, CreepBaseInterface } from "./creep-base";
import { SourceManager } from "managers/sources-manager";

export interface MinerInterface {
	tryHarvest(creep: Creep): number;
	moveToHarvest(creep: Creep): void;

	action(creep: Creep): boolean;
}

export class Miner extends CreepBase implements MinerInterface, CreepBaseInterface {
	public tryHarvest(creep: Creep): number {
		return creep.harvest(SourceManager.getNearestSource(creep));
	}

	public moveToHarvest(creep: Creep): void {
		if (this.tryHarvest(creep) == ERR_NOT_IN_RANGE) {
			this.moveTo(creep, SourceManager.getNearestSource(creep), "#B22222");
		}
	}

	public action(creep: Creep): boolean {
		if (super.action(creep)){
			return;
		}

		this.moveToHarvest(creep);

		return true
	}
}
