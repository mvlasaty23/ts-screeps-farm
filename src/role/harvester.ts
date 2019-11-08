import { CreepRenewer } from '../module/creepRenewer';

export namespace Harvester {
	/** @param {Creep} creep **/
	export function run(creep: Creep) {
		if (CreepRenewer.run(creep)) {
			return;
		}

		if(creep["store"].getFreeCapacity() > 0) {
			//var sources = creep.room.find(FIND_SOURCES);
			var source: Source  = creep.pos.findClosestByPath(FIND_SOURCES);
			if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
		else {
			// first load Spawn then all other
			if (loadSpawn(creep)) {
				return;
			}

			// then load Extensions
			if (loadExtensions(creep)) {
				return;
			}

			// load all other
			var targets: Structure[] = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION ||
						structure.structureType == STRUCTURE_SPAWN ||
						structure.structureType == STRUCTURE_TOWER ||
						structure.structureType == STRUCTURE_CONTAINER) &&
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

	function loadSpawn(creep: Creep) {
		var objects: Structure[] = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_SPAWN) &&
					structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
			}
		});
		if (objects.length > 0) {
			if(creep.transfer(objects[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(objects[0], {visualizePathStyle: {stroke: '#2F4F4F'}});
			}
			return true;
		}
		return false;
	}

	function loadExtensions(creep: Creep) {
		var objects: Structure[] = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_EXTENSION) &&
					structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
			}
		});
		if (objects.length > 0) {
			if(creep.transfer(objects[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(objects[0], {visualizePathStyle: {stroke: '#2F4F4F'}});
			}
			return true;
		}
		return false;
	}
}
