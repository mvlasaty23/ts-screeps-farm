
import { CreepManager } from "creeps/creep-manager";
import { MemoryManager } from "memory-manager";
import { RoomManager } from "rooms/room-manager";
import { SourceManager } from "sources/sources-manager";
import { SpawnManager } from "spawns/spawn-manager";

/**
 * Singleton object.
 * Since singleton classes are considered anti-pattern in Typescript, we can effectively use namespaces.
 * Namespace's are like internal modules in your Typescript application. Since GameManager doesn't need multiple instances
 * we can use it as singleton.
 */
export namespace GameManager {

    export function globalBootstrap() {
        // Set up your global objects.
        // This method is executed only when Screeps system instantiated new "global".

        // Use this bootstrap wisely. You can cache some of your stuff to save CPU
        // You should extend prototypes before game loop in here.
        RoomManager.loadRooms();
        SpawnManager.loadSpawns();
        SourceManager.loadSources();
    }

    export function loop() {
        // Loop code starts here
		// This is executed every tick
		// TowerController.run();
		// CreepController.run();
		// RespawnController.run();


		MemoryManager.loadMemory();
		CreepManager.loadCreeps();

		CreepManager.startManageCreeps();

		for(var name in Memory.creeps) {
			if(!Game.creeps[name]) {
				delete Memory.creeps[name];
				console.log('Clearing non-existing creep memory:', name);
			}
		}
    }

}
