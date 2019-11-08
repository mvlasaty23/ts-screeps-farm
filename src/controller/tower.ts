export namespace TowerController {
	export function run(): boolean {
		let tower: StructureTower = Game.getObjectById('TOWER_ID');
		if(tower) {
			let closestDamagedStructure: Structure | StructureSpawn = tower.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure: Structure | StructureSpawn) => structure.hits < structure.hitsMax
			});
			if(closestDamagedStructure) {
				tower.repair(closestDamagedStructure);
			}

			let closestHostile: Creep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if(closestHostile) {
				tower.attack(closestHostile);
			}
		}
		return false;
	}
};
