import { RoomManager } from "./room-manager";

export namespace SourceManager {
    export function getFirstSource(): Source {
        return RoomManager.getFirstRoom().find<Source>(FIND_SOURCES_ACTIVE)[0];
	}

	export function getNearestSource(creep: Creep): Source {
		return creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
	}

	export function getAllSource(): Source[] {
		const sources = RoomManager.getFirstRoom().find<Source>(FIND_SOURCES);
		return sources;
	}

	export function getFirstConstructionSite(): ConstructionSite {
		return RoomManager.getFirstRoom().find<ConstructionSite>(FIND_CONSTRUCTION_SITES)[0];
	}

	export function getNearestConstructionSite(pos: RoomPosition): ConstructionSite {
		return pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	}

	export function getFirstController(): StructureController {
		return RoomManager.getFirstRoom().controller;
	}

	export function getNearestContainer(pos: RoomPosition): StructureContainer {
		const container = pos.findClosestByRange<StructureContainer>(FIND_STRUCTURES, {
			filter: (structure: StructureContainer) => {
				return ((structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity() > 50);
			}
		});
		return container;
	}

	export function getContainerLength(): number {
		const container = RoomManager.getFirstRoom().find<StructureContainer>(FIND_STRUCTURES, {
			filter: (structure: Structure) => {
				return (structure.structureType == STRUCTURE_CONTAINER);
			}
		});
		return container.length;
	}

	// export function getMinerEnergyDropoff(): Structure {

	// }

	export function getNearestMaintainObject(pos: RoomPosition): Structure {
		let result = pos.findClosestByRange<Structure>(FIND_STRUCTURES, {
			filter: object => (object.hits < object.hitsMax) && (object.structureType == STRUCTURE_CONTAINER || object.structureType == STRUCTURE_ROAD)
		});
		return result;
	}

	export function getFirstWallToRepair(): StructureWall {
		var result = RoomManager.getFirstRoom().find<StructureWall>(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_WALL);
			}
		});
		return result.length ? result[0] : undefined;
	}
}
