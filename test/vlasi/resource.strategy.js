const GATHER_ENERGY = 'gatherEnergy';

function isOutOfEnergy(creep) {
  return creep.memory.task !== GATHER_ENERGY && creep.carry[RESOURCE_ENERGY] === 0;
}
function isGatheringEnergy(creep) {
  return creep.memory.task === GATHER_ENERGY && creep.carry[RESOURCE_ENERGY] < creep.carryCapacity;
}
function shouldHarvestEnergy(creep) {
  return !creep.memory.task || isOutOfEnergy(creep) || isGatheringEnergy(creep);
}

function doHarvest(creep, target) {
  let result = -20;
  if(target && (result = creep.harvest(target)) === ERR_NOT_IN_RANGE) {
    result = creep.moveTo(target);
  }
  return result;
}

function doWithdraw(creep, target) {
  let result = -20;
  if(target && (result = creep.withdraw(target, RESOURCE_ENERGY)) === ERR_NOT_IN_RANGE) {
    result = creep.moveTo(target);
  }
  return result;
}

function rememberOldEnergySource(creep) {
  return Game.getObjectById(creep.memory.energySourceId);
}
function rememberNewEnergySource(creep, source) {
  creep.memory.energySourceId = source ? source.id : undefined;
}

module.exports = {
  harvestNearestEnergySource: (creep) => {
    let result = -20;
    if(shouldHarvestEnergy(creep)) {
      creep.memory.task = GATHER_ENERGY;
      let energySource = rememberOldEnergySource(creep);
      if(!energySource || energySource.storage /*|| energySource.energy < 1*/) {
        energySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
          filter: (i) => i.energy > 0,
        });
        rememberNewEnergySource(creep, energySource);
      }

      if(energySource) {
        result = doHarvest(creep, energySource);
      }
    }
    return result;
  },
  harvestFixedEnergySource: (creep) => {
    let result = -20;
    if(shouldHarvestEnergy(creep)) {
      creep.memory.task = GATHER_ENERGY;
      let energySource = rememberOldEnergySource(creep);
      if(!energySource || energySource.storage) {
        // TODO: use room.memory to fix miner on energy source?


        // get sourcePlan
        let sourcePlan = creep.room.memory.sourcePlan;
        if(!sourcePlan) {
          const energySources = creep.room.find(FIND_SOURCES_ACTIVE);
          sourcePlan = energySources.map(source => {
            const obj = {};
            obj[source.id] = [];
          })
          .reduce((prev, next) => Object.assign({}, prev, next), {});
          creep.room.memory.sourcePlan = sourcePlan;
        }

        // get first unassigned source or assign to first with lowest miners
        if(Object.keys(sourcePlan) > 0) {
          const unassignedIdx = Object.keys(sourcePlan)
          .map(id => sourcePlan[id])
          .findIndex(plan => plan.length === 0);
          if(unassignedIdx !== -1) {
            const plan = sourcePlan[unassignedIdx];
            plan.push(creep.id);
            rememberNewEnergySource(creep, {id: sourceId});
            energySource = rememberOldEnergySource(creep);
          } else {

          }
        }
        energySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
          filter: (i) => i.energy > 0,
        });
        rememberNewEnergySource(creep, energySource);
      }

      if(energySource) {
        result = doHarvest(creep, energySource);
      }
    }
    return result;
  },
  harvestEnergyFromNearestContainer: (creep) => {
    let result = -20;
    if(shouldHarvestEnergy(creep)) {
      creep.memory.task = GATHER_ENERGY;
      let energySource = rememberOldEnergySource(creep);
      if(!energySource || !energySource.store || energySource.store[RESOURCE_ENERGY] < 1) {
        energySource = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0,
        });
        rememberNewEnergySource(creep, energySource);
      }

      if(energySource) {
        result = doWithdraw(creep, energySource);
      }
    }
    return result;
  },
  harvestEnergyFromNearestStorage: (creep) => {
    let result = -20;
    if(shouldHarvestEnergy(creep)) {
      creep.memory.task = GATHER_ENERGY;
      let energySource = rememberOldEnergySource(creep);
      if(!energySource || energySource.structureType !== STRUCTURE_STORAGE || energySource.store[RESOURCE_ENERGY] < 1) {
        energySource = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          filter: (i) => i.structureType === STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] > 0,
        });
        rememberNewEnergySource(creep, energySource);
      }

      if(energySource) {
        result = doWithdraw(creep, energySource);
      }
    }
    return result;
  },
  rememberOldEnergySource,
};
