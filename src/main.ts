import { CreepManager } from 'managers/creep-manager';
import { TowerManager } from 'managers/tower-manager';
import { BuildManager } from 'managers/build-manager';
import { EventManager } from 'managers/event-manager';

export const loop = function() {

	EventManager.run();

	CreepManager.run();

	TowerManager.run();

	BuildManager.run();

	// Clear dead creep memory
	for(var name in Memory.creeps) {
		if(!Game.creeps[name]) {
			delete Memory.creeps[name];
			console.log('Clearing non-existing creep memory:', name);
		}
	}
}
