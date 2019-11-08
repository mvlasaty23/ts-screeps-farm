export namespace RespawnController {
	export function run() {
		let harvesterAmount = 4;
		let harvesterContainerAmount = 2;
		let upgraderAmount = 2;
		let builderAmount = 3;
		let harvesterOptions = [WORK, WORK, CARRY, CARRY, CARRY, MOVE];
		let upgraderOptions = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
		let builderOptions = [WORK, WORK, CARRY, CARRY, CARRY, MOVE];
		for(var name in Memory.creeps) {
			if(!Game.creeps[name]) {
				delete Memory.creeps[name];
				console.log('Clearing non-existing creep memory:', name);
			}
		}

		// harvester spawn
		if (spawnCreep('harvester', harvesterAmount, harvesterOptions)){
			return;
		}

		// upgrader spawn
		if (spawnCreep('upgrader', upgraderAmount, upgraderOptions)) {
			return;
		}

		// harvester spawn
		if (spawnCreep('harvesterContainer', harvesterContainerAmount, harvesterOptions)) {
			return;
		}

		// builder spawn
		if (spawnCreep('builder', builderAmount, builderOptions)) {
			return;
		}
		return;
	}

	function spawnCreep(role: string, amount: number, options: string[]) {
		var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
		if(creeps.length < amount) {
			var newName = role +'_' + Game.time;
			var testIfCanSpawn = Game.spawns['Spawn1'].spawnCreep(options,
				newName, { dryRun: true });
			console.log(role,"vorhanden: " + creeps.length, "gewünscht: "+  amount);
			if (testIfCanSpawn == 0) {
				console.log('Spawning new ' + role + ': ' + newName);
				Game.spawns['Spawn1'].spawnCreep(options, newName,
					{memory: {role: role}});
				return true;
			} else {
				// console.log('Cant spawn new builder now!');
				return false;
			}
		}
	}
};
