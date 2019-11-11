import { RoomManager } from "./room-manager";
import { Tower } from "structure/tower";

export namespace TowerManager {
	export function run() {
		const towers = RoomManager.getFirstRoom().find<StructureTower>(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_TOWER);
			}
		});

		towers.forEach(tower => {
			new Tower().action(tower);
		})
	}

	export function getTowers(): StructureTower[] {
		const towers = RoomManager.getFirstRoom().find<StructureTower>(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_TOWER);
			}
		});
		return towers;
	}
}
