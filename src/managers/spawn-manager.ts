import { RoomManager } from "./room-manager";

export namespace SpawnManager {
    export function getFirstSpawn(): Spawn {
		let result: StructureSpawn = null;
		for(const i in Game.spawns) {
			result = Game.spawns[i]
		}
        return result;
	}

	export function getEnergyAvailable(): number {
		return RoomManager.getFirstRoom().energyAvailable;
	}

	export function getExtensionsLength(): number {
		let extensions = RoomManager.getFirstRoom().find<Extension>(FIND_STRUCTURES, {
			filter: (object: Extension) => (object.structureType == STRUCTURE_EXTENSION)
		});
		return extensions.length;
	}

	export function getPlannedExtensionsLength(): number {
		const plannedExtensions = RoomManager.getFirstRoom().find(FIND_CONSTRUCTION_SITES, {
			filter: (object: ConstructionSite) => (object.structureType == STRUCTURE_EXTENSION)
		});
		return plannedExtensions.length;
	}
}
