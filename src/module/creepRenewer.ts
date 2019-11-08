export namespace CreepRenewer {
	/** @param {Creep} creep **/
	export function run(creep: Creep) : boolean {
		if (creep.ticksToLive < 100 || creep.memory.repairing == true) {
			creep.memory.repairing = true;
			if (Game.spawns['Spawn1'].renewCreep(creep) == ERR_NOT_IN_RANGE) {
				creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#FF69B4'}});
			}

			creep.say('♻️');

			if (creep.ticksToLive > 1300) {
				creep.memory.repairing = false;
				console.log('renewCreep ' + creep + ' finished! 👍');
				creep.say('👍');
			}

			return creep.memory.repairing;
		}
		return false;
	}
}
