let creepIdToRecycle = [" "];
export namespace CreepRecycler {
	/** @param {Creep} creep **/
	export function run(creep: Creep) : boolean {

		// recycle creep
		if (creepIdToRecycle.indexOf(creep.id) > -1) {
			if (Game.spawns['Spawn1'].recycleCreep(creep) == ERR_NOT_IN_RANGE) {
				creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#FF0000'}});
				console.log("⚰️ " + creep);
			}
			return true;
		}

		return false;
	}
}
