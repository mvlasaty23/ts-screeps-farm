import { SpawnManager } from "./spawn-manager";
import { RoomManager } from "./room-manager";

export namespace EventManager {
	export function run() {
		const controllerLevel = RoomManager.getFirstRoom().controller.level;
		if (SpawnManager.getFirstSpawn().memory.controllerUpgradet || SpawnManager.getFirstSpawn().memory.savedControllerLevel < controllerLevel) {
			SpawnManager.getFirstSpawn().memory.savedControllerLevel = controllerLevel;
			SpawnManager.getFirstSpawn().memory.controllerUpgradet = true;
			console.log("Set SpawnManager.getFirstSpawn().memory.controllerUpgradet to true!");
		}
	}

}
