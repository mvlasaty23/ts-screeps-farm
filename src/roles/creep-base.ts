import { RoomManager } from "managers/room-manager";
import { SpawnManager } from "managers/spawn-manager";

export interface CreepBaseInterface {
	isBagEmpty(creep: Creep): boolean;
	isBagFull(creep: Creep): boolean;
    moveTo(creep: Creep, target: RoomPosition|{pos: RoomPosition}, color: string): number;
    action(creep: Creep): boolean;
}

export class CreepBase implements CreepBaseInterface {

	public isBagEmpty(creep: Creep): boolean {
		return (creep.carry.energy == 0);
	}

	public isBagFull(creep: Creep): boolean {
		return (creep.carry.energy == creep.carryCapacity);
	}

	public getBagUsedCapacity(creep: Creep): number {
		return creep.carry.energy;
	}

    public moveTo(creep: Creep, target: RoomPosition|{pos: RoomPosition}, color: string) {
        return creep.moveTo(target, {visualizePathStyle: {stroke: color}});
    }

    public action(creep: Creep): boolean {
		let hostiles = RoomManager.detectHostiles();
		if (hostiles.length) {
			// attack
			if (creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE) {
				this.moveTo(creep, hostiles[0], "#FF0000");
			}
			// return true to break execution after
			return true;
		} else if (["7822c3309624766"].indexOf(creep.id) > -1) { // kill creep
			creep.say("🧟‍♂️");
			if (SpawnManager.getFirstSpawn().recycleCreep(creep) == ERR_NOT_IN_RANGE) {
				this.moveTo(creep, SpawnManager.getFirstSpawn().pos, "#FF0000");
			}
			return true;
		}

        return false;
    }
}
