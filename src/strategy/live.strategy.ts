import { rememberOldEnergySource } from "./resource.strategy";

export function respawn() {
  return true;
}

export function renewMiner(creep: Creep) {
  let result = true;
  const shouldRenew = creep.memory.renew;
  const source = rememberOldEnergySource(creep);

  if (shouldRenew || creep.ticksToLive < 250 || (source && source.energyCapacity === 0 && creep.ticksToLive < 1300)) {
    creep.memory.renew = true;
    const spawn = creep.memory.initialSpawn ? Game.spawns[creep.memory.initialSpawn] : undefined;

    if (spawn) {
      if (creep.carry.energy > 0) {
        creep.drop(RESOURCE_ENERGY);
      }

      const renewing = spawn.renewCreep(creep);
      if (renewing === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn);
        result = false;
      } else if (renewing === OK || renewing === ERR_NOT_ENOUGH_ENERGY || renewing === ERR_BUSY) {
        result = false;
      } else if (renewing === ERR_FULL) {
        creep.memory.renew = false;
      }
    }
  }
  return result;
}
