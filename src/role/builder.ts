import { CreepRenewer } from '../module/creepRenewer';

export namespace Builder {
	/** @param {Creep} creep **/
	export function run(creep: Creep) {
			if (CreepRenewer.run(creep)) {
					return;
			}

			if(creep.memory.building && creep["store"][RESOURCE_ENERGY] == 0) {
					creep.memory.building = false;
					creep.say('🔄 harvest');
			}

			if(!creep.memory.building && creep["store"].getFreeCapacity() == 0) {
					creep.memory.building = true;
					creep.say('🚧 build');
			}

			if(creep.memory.building) {
					// var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
					// if(targets.length) {
					// 		if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					// 				creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#8B4513'}});
					// 				creep.say('🐌');
					// 		}
					// }

					var target: ConstructionSite = Game.getObjectById("5dc5407e2e9aa39b8bcaf9b7");
					if (target) {
						if(creep.build(target) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target, {visualizePathStyle: {stroke: '#8B4513'}});
							creep.say('🐌');
						}
					}
			}
			else {
					var sources: Source[] = creep.room.find(FIND_SOURCES);
					if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
					}
			}
	}
}
