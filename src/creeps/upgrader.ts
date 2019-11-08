import {CreepActionInterface, CreepAction} from "./creep-action"
import { SpawnManager } from "spawns/spawn-manager";
import { SourceManager } from "sources/sources-manager";

export interface UpgraderInterface {

    controller: Controller;
    targetSource: Source;

    isBagFull(): boolean;
    tryUpgrade(): number;
    moveToUpgrade(): void;
    tryHarvestEnergy(): number;
    moveToHarvestEnergy(): void;

    action(): boolean;
}

export class Upgrader extends CreepAction implements UpgraderInterface, CreepActionInterface {

    public controller: Controller = null;
	public targetSource: Source = null;
	public targetContainerSource: StructureContainer = null;

    public setCreep(creep: Creep) {
        super.setCreep(creep);

		if (!this.creep.memory.targetControllerId) {
			this.creep.memory.targetControllerId = SourceManager.getFirstController().id;
			console.log("filled");
		}
		if (!this.creep.memory.targetSourceId) {
			this.creep.memory.targetSourceId = SourceManager.getFirstSource().id;
		}
		if (!this.creep.memory.targetContainerSourceId) {
			this.creep.memory.targetContainerSourceId = SourceManager.getFirstContainer().id;
		}
		if (!this.creep.memory.renew_station_id) {
			this.creep.memory.renew_station_id = SpawnManager.getFirstSpawn().id;
		}
        this.controller = <Controller>Game.getObjectById(this.creep.memory.targetControllerId);
		this.targetSource = <Source>Game.getObjectById(this.creep.memory.targetSourceId);
		this.targetContainerSource = <StructureContainer>Game.getObjectById(this.creep.memory.targetContainerSourceId);
    }

    public isBagFull(): boolean {
        return (this.creep.carry.energy == this.creep.carryCapacity);
	}

	public isBagEmpty(): boolean {
        return (this.creep.carry.energy == 0);
	}

    public tryUpgrade(): number {
        return this.creep.upgradeController(this.controller);
    }

    public moveToUpgrade(): void {
        if (this.tryUpgrade() == ERR_NOT_IN_RANGE) {
            this.moveTo(this.controller, "#B22222");
        }
    }

    public tryHarvestEnergy(): number {
        return this.creep.harvest(this.targetSource);
	}

	public shouldHarvestFromContainer(): boolean {
		return this.targetContainerSource.store.getUsedCapacity(RESOURCE_ENERGY) > 50;
	}

	public tryToWithdrawEnergy(): number {
		return this.creep.withdraw(this.targetContainerSource, RESOURCE_ENERGY);
	}

    public moveToHarvestEnergy(): void {
		if (this.shouldHarvestFromContainer() && this.tryToWithdrawEnergy() == ERR_NOT_IN_RANGE) {
			this.moveTo(this.targetContainerSource, "#FFD700");
		} else if (this.tryHarvestEnergy() == ERR_NOT_IN_RANGE) {
            this.moveTo(this.targetSource, "#FFD700");
        }
	}

    public action(): boolean {
		if (this.needsRenew()) {
            this.moveToRenew();
        } else if (this.isBagFull() || this.creep.memory.unloadInProgress) {
			this.creep.memory.unloadInProgress = true;
			this.moveToUpgrade();

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
