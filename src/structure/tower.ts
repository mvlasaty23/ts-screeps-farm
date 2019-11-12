import { RoomManager } from "managers/room-manager";
import { SourceManager } from "managers/sources-manager";
import { CreepManager } from "managers/creep-manager";

export interface TowerInterface {
	heal(tower: StructureTower): void;
	attackHostiles(tower: StructureTower): void;

    action(tower: StructureTower): boolean;
}

export class Tower implements TowerInterface {
	public heal(tower: StructureTower): boolean {
		let creep = CreepManager.getNearestCreepToHeal(tower.pos);
		if (tower.heal(creep) == OK) {
			return true;
		}
		return false;
	}

    public action(tower: StructureTower): boolean {
		if (this.attackHostiles(tower)) {
			return true;
		} else if (this.heal(tower)) {
			return true;
		} else {
			tower.repair(SourceManager.getNearestMaintainObject(tower.pos));
			return true;
		}

        return false
    }

	public attackHostiles(tower: StructureTower): boolean {
		var hostiles: Creep[] = RoomManager.getFirstRoom().find(FIND_HOSTILE_CREEPS);
		if(hostiles.length > 0) {
			var username = hostiles[0].owner.username;
			var roomName = RoomManager.getFirstRoom().name;
			Game.notify(`User ${username} spotted in room ${roomName}`);
			tower.attack(hostiles[0]);
			// console.log("attack hostile!! " + hostiles[0].name);
			return true;
		}
		return false;
	}
}
