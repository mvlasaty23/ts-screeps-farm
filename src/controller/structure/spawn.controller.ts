export class SpawnController {
  private spawns: Spawn[];
  // private primarySpawn: Spawn;

  constructor(private room: Room) {
    this.spawns = this.room.find<Spawn>(FIND_MY_SPAWNS); // ids could be cached?
    // this.primarySpawn = this.spawns[0];
  }

  public spawnCreepsByCount(creepDefs) {
    const freeSpawn = this.spawns.find((spawn) => !spawn.spawning);
    if (freeSpawn) {
      // TODO: add check to only spawn if Game.creeps.length < creepDefs.desiredCount
      // const options = {
      //   energyCap: this.room.energyCapacityAvailable,
      //   rcl: this.room.controller.level,
      // }; // use this as starting point for room strategy?
      return spawnCreepsByCountOrdered(creepDefs, freeSpawn, freeSpawn.room.find(FIND_MY_CREEPS));
    }
    return false;
  }
}

function spawnCreepsByCountOrdered(creepDefs, spawn, livingCreeps) {
  return creepDefs.find(firstSpawningCreep(spawn, livingCreeps));
}

function spawnCreepWithGameTime(spawn) {
  return (creepDef) => {
    const name = `${creepDef.type.name}-${creepDef.role.name}-${Game.time}`;
    return spawn.spawnCreep(creepDef.type.body, name, {
      memory: {
        type: creepDef.type.name,
        role: creepDef.role.name,
        initialSpawn: spawn.name,
      },
    });
  };
}

function creepByTypeAndRole({ role, type }) {
  return ({ memory }) => memory.role === role.name && memory.type === type.name;
}

function firstSpawningCreep(spawn, livingCreeps) {
  return (creepDef) => {
    let didSpawn = false;
    const creeps = livingCreeps.filter(creepByTypeAndRole(creepDef));
    if (creeps.length < creepDef.count || creepDef.count === -1) {
      const result = spawnCreepWithGameTime(spawn)(creepDef);
      didSpawn = result === OK || result === ERR_NOT_ENOUGH_ENERGY;
    }
    return didSpawn;
  };
}
