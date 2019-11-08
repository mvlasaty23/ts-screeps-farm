import { Harvester } from "../role/harvester";
import { HarvesterContainer } from "../role/harvesterContainer";
import { Builder } from "../role/builder";
import { Upgrader } from "../role/upgrader";
import { CreepRecycler } from "../module/creepRecycler";

export namespace CreepController {
	export function run(): boolean {
		for(var name in Game.creeps) {
			var creep = Game.creeps[name];

			if (CreepRecycler.run(creep)) {
				continue;
			}
			if(creep.memory.role == 'harvester') {
				Harvester.run(creep);
			}
			if(creep.memory.role == 'harvesterContainer') {
				HarvesterContainer.run(creep);
			}
			if(creep.memory.role == 'upgrader') {
				Upgrader.run(creep);
			}
			if(creep.memory.role == 'builder') {
				Builder.run(creep);
			}
		}
		return false;
	}
}
