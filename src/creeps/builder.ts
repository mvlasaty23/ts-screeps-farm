import {CreepActionInterface, CreepAction} from "./creep-action"
import { SourceManager } from "sources/sources-manager";
import { SpawnManager } from "spawns/spawn-manager";

export interface BuilderInterface {

    target: ConstructionSite;
    energySource: Source;

    isBagFull(): boolean;
    tryBuild(): number;
    moveToBuild(): void;
    tryHarvestEnergy(): number;
    moveToHarvestEnergy(): void;

    action(): boolean;
}

export class Builder extends CreepAction implements BuilderInterface, CreepActionInterface {

    public target: ConstructionSite = null;
    public energySource: Source = null;

    public setCreep(creep: Creep) {
        super.setCreep(creep);

		if (!this.creep.memory.energySourceId) {
			this.creep.memory.energySourceId = SourceManager.getFirstSource().id;
		}
		if (!this.creep.memory.renew_station_id) {
			this.creep.memory.renew_station_id = SpawnManager.getFirstSpawn().id;
		}

		var targets: ConstructionSite[] = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(targets.length) {
			this.target = targets[0];
		}
        this.energySource = <Source>Game.getObjectById(this.creep.memory.energySourceId);
    }

    public isBagFull(): boolean {
        return (this.creep.carry.energy == this.creep.carryCapacity);
    }

	public isBagEmpty(): boolean {
        return (this.creep.carry.energy == 0);
	}

    public tryBuild(): number {
		this.creep.say('🐌');
        return this.creep.build(this.target);
    }

    public moveToBuild(): void {
        if (this.tryBuild() == ERR_NOT_IN_RANGE) {
            this.moveTo(this.target, "#B22222");
        }
    }

    public tryHarvestEnergy(): number {
		let result = this.creep.harvest(this.energySource);
        return result;
    }

    public moveToHarvestEnergy(): void {
        if (this.tryHarvestEnergy() === ERR_NOT_IN_RANGE) {
            this.moveTo(this.energySource, "#FFD700");
        }
    }

    public action(): boolean {
        if (this.needsRenew()) {
            this.moveToRenew();
        } else if (this.isBagFull() || this.creep.memory.unloadInProgress) {
			this.creep.memory.unloadInProgress = true;
            this.moveToBuild();

			// reset unloadInProgress if bag is empty!
			if (this.isBagEmpty()) {
				this.creep.memory.unloadInProgress = false;
			}
        } else {
            this.moveToHarvestEnergy();
        }

        return true
    }
}
