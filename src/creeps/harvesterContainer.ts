import { CreepActionInterface, CreepAction } from "./creep-action"
import { SourceManager } from "sources/sources-manager";
import { SpawnManager } from "spawns/spawn-manager";

export interface HarvesterContainerInterface {

    targetSource: Source;
    targetEnergyDropOff: Spawn|Structure;

    isBagFull(): boolean;
    tryHarvest(): number;
    moveToHarvest(): void;
    tryEnergyDropOff(): number;
    moveToDropEnergy(): void;

    action(): boolean;
}

export class HarvesterContainer extends CreepAction implements HarvesterContainerInterface, CreepActionInterface {

    public targetSource: Source = null;
    public targetEnergyDropOff: Structure = null;

    public setCreep(creep: Creep) {
        super.setCreep(creep);

		if (!this.creep.memory.targetSourceId) {
			this.creep.memory.targetSourceId = SourceManager.getFirstSource().id;
			console.log("filled");
		}
		if (!this.creep.memory.renew_station_id) {
			this.creep.memory.renew_station_id = SpawnManager.getFirstSpawn().id;
		}
		// this.targetSource = <Source>Game.getObjectById(this.creep.memory.targetSourceId);
		this.targetSource = Game.getObjectById("5bbcaeb89099fc012e639753");

        this.targetEnergyDropOff = SourceManager.getFirstContainer();
    }

    public isBagFull(): boolean {
        return (this.creep.carry.energy == this.creep.carryCapacity);
    }

    public tryHarvest(): number {
        return this.creep.harvest(this.targetSource);
    }

    public moveToHarvest(): void {
        if (this.tryHarvest() == ERR_NOT_IN_RANGE) {
            this.moveTo(this.targetSource, "#B22222");
        }
    }

    public tryEnergyDropOff(): number {
		this.creep.say("🔋");
        return this.creep.transfer(this.targetEnergyDropOff, RESOURCE_ENERGY);
    }

    public moveToDropEnergy(): void {
        if (this.tryEnergyDropOff() == ERR_NOT_IN_RANGE) {
            this.moveTo(this.targetEnergyDropOff, "#FFD700");
        }
    }

    public action(): boolean {
        if (this.needsRenew()) {
            this.moveToRenew();
        } else if (this.isBagFull()) {
            this.moveToDropEnergy();
        } else {
            this.moveToHarvest();
        }

        return true
    }
}
