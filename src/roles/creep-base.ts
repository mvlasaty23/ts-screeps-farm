import { RoomManager } from "managers/room-manager";
import { SpawnManager } from "managers/spawn-manager";

export interface CreepBaseInterface {
    moveTo(creep: Creep, target: RoomPosition|{pos: RoomPosition}, color: string): number;
    action(creep: Creep): boolean;
}

export class CreepBase implements CreepBaseInterface {

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
		} else if (["8a22cb2016a6ca9", "da3acca4f776ea6"].indexOf(creep.id) > -1) { // kill creep
			creep.say("🧟‍♂️");
			if (SpawnManager.getFirstSpawn().recycleCreep(creep) == ERR_NOT_IN_RANGE) {
				this.moveTo(creep, SpawnManager.getFirstSpawn().pos, "#FF0000");
			}
			return true;
		}

        return false;
    }
}
