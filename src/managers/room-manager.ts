export namespace RoomManager {
    export function getFirstRoom(): Room {
		let result: Room;
		for(const i in Game.rooms) {
			result = Game.rooms[i]
		}
        return result;
	}

	export function getFirstRoomName(): string {
		for(const i in Game.rooms) {
			return i;
		}
	}

	export function detectHostiles(): Creep[] {
		return getFirstRoom().find(FIND_HOSTILE_CREEPS);
	}

	export function getStorage(): StructureStorage {
		return getFirstRoom().storage;
	}
}
