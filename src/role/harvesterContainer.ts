import { CreepRenewer } from '../module/creepRenewer';

export namespace HarvesterContainer {

	/** @param {Creep} creep **/
	export function run(creep: Creep) {
		creep.say('🔥');
		if (CreepRenewer.run(creep)) {
			return;
		}

		if(creep["store"].getFreeCapacity() > 0) {
			var source: Source = creep.pos.findClosestByPath(FIND_SOURCES);
			// console.log(source);
			// var mySource =  Game.getObjectById('5bbcaeb89099fc012e639753');
			// console.log(mySource);
			if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
		else {
			var targets: StructureContainer[] = creep.room.find(FIND_STRUCTURES, {
				filter: (structure: StructureContainer) => {
					return (structure.structureType == STRUCTURE_CONTAINER) &&
						structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
				}
			});
			if(targets.length > 0) {
				if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#2F4F4F'}});
				}
			}
		}
	}
};
