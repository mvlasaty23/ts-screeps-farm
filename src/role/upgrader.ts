import { CreepRenewer } from '../module/creepRenewer';

export namespace Upgrader {
	/** @param {Creep} creep **/
	export function run(creep: Creep) {
		if (CreepRenewer.run(creep)) {
			return;
		}
		if(creep.memory.upgrading && creep["store"][RESOURCE_ENERGY] == 0) {
			creep.memory.upgrading = false;
			creep.say('🔄 harvest');
		}

		if(!creep.memory.upgrading && creep["store"].getFreeCapacity() == 0) {
			creep.memory.upgrading = true;
			creep.say('⚡ upgrade');
		}

		if(creep.memory.upgrading) {
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#32CD32'}});
			}
		}
		else {
			// Find container
			var objects: StructureContainer[] = creep.room.find(FIND_STRUCTURES, {
				filter: (structure: Structure) => {
					return (structure.structureType == STRUCTURE_CONTAINER);
				}
			});

			// take from container
			if (objects.length > 0 && objects[0].store.getUsedCapacity(RESOURCE_ENERGY) > 50) {
				if(creep.withdraw(objects[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(objects[0], {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			} else { // take from source

				var source: Source = creep.pos.findClosestByPath(FIND_SOURCES);
				if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			}
		}
	}
};
