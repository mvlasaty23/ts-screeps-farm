import { CreepBase, CreepBaseInterface } from "./creep-base";

export interface MinerInterface {
	tryHarvest(creep: Creep): number;
	moveToHarvest(creep: Creep): void;

	action(creep: Creep): boolean;
}

export class Miner extends CreepBase implements MinerInterface, CreepBaseInterface {
	public tryHarvest(creep: Creep): number {
		const target = Game.getObjectById<Source>(creep.memory.sourceId);
		return creep.harvest(target);
	}

	public moveToHarvest(creep: Creep): void {
		const result = this.tryHarvest(creep);
		if (result == ERR_NOT_IN_RANGE) {
			const target = Game.getObjectById<Source>(creep.memory.sourceId);
			this.moveTo(creep, target, "#B22222");
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
