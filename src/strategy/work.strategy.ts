const WORK = 'work';

function carriesEnergy(creep) {
  return creep.carry[RESOURCE_ENERGY] > 0;
}
function shouldTransferEnergy(creep) {
  return (
    (creep.memory.task !== WORK && creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) ||
    (creep.memory.task === WORK && carriesEnergy(creep))
  );
}

function needsEnergy(structure) {
  if (structure) {
    return structure.energy < structure.energyCapacity;
  } else {
    return false;
  }
}

function rememberLastExtension(creep): Extension {
  return Game.getObjectById(creep.memory.extensionId);
}

function rememberNewExtension(creep, extension) {
  creep.memory.extensionId = extension ? extension.id : undefined;
  return extension;
}

function rememberLastRepair(creep): Structure {
  return Game.getObjectById(creep.memory.structToRepair);
}

function rememberNewRepair(creep, structure) {
  creep.memory.structToRepair = structure ? structure.id : undefined;
  return structure;
}

function rememberLastConstructionSite(creep): ConstructionSite {
  return Game.getObjectById(creep.memory.constructionSiteId);
}

function rememberNewConstructionSite(creep, site) {
  creep.memory.constructionSiteId = site ? site.id : undefined;
  return site;
}

function rememberLastContainer(creep: Creep): Container {
  return Game.getObjectById(creep.memory.containerId);
}

function rememberNewContainer(creep: Creep, container: Container) {
  creep.memory.containerId = container ? container.id : undefined;
  return container;
}

function rememberLastStorage(creep: Creep): Storage {
  return Game.getObjectById(creep.memory.storageId);
}

function rememberNewStorage(creep: Creep, storage: Storage) {
  creep.memory.storageId = storage ? storage.id : undefined;
  return storage;
}

function rememberLastTower(creep: Creep): Tower {
  return Game.getObjectById(creep.memory.towerId);
}

function rememberNewTower(creep, tower) {
  creep.memory.towerId = tower ? tower.id : undefined;
  return tower;
}

function moveTo(creep, target) {
  return creep.moveTo(target);
}

function repair(creep, target) {
  return creep.repair(target);
}

function getInitialSpawn(creep) {
  return creep.memory.initialSpawn;
}

export function transferEnergyToSpawner(spawnerName: string) {
  // TODO: refactor to use spawner of current room
  return (creep: Creep) => {
    let result = -20;
    const spawn = Game.spawns[spawnerName];
    if (shouldTransferEnergy(creep) && needsEnergy(spawn)) {
      creep.memory.task = WORK;
      result = creep.transfer(spawn, RESOURCE_ENERGY);
      if (result === ERR_NOT_IN_RANGE) {
        result = creep.moveTo(spawn);
      }
    }
    return result;
  };
}

export function transferEnergyToInitialSpawner(creep: Creep) {
  let result = -20;
  const spawn = Game.spawns[getInitialSpawn(creep)];
  if (shouldTransferEnergy(creep) && needsEnergy(spawn)) {
    creep.memory.task = WORK;
    result = creep.transfer(spawn, RESOURCE_ENERGY);
    if (result === ERR_NOT_IN_RANGE) {
      result = creep.moveTo(spawn);
    }
  }
  return result;
}

export function transferEnergyToNearestSpawnerExtension(creep: Creep) {
  let result = -20;

  if (shouldTransferEnergy(creep)) {
    creep.memory.task = WORK;
    let extension = rememberLastExtension(creep);

    if (!extension || extension.energy === extension.energyCapacity) {
      extension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: obj => obj.structureType === STRUCTURE_EXTENSION && obj.energy < obj.energyCapacity,
      });
      rememberNewExtension(creep, extension);
    }

    if (extension) {
      result = creep.transfer(extension, RESOURCE_ENERGY);
      if (result === ERR_NOT_IN_RANGE) {
        result = creep.moveTo(extension);
      }
    }
  }
  return result;
}

export function transferEnergyToNearestContainer(creep: Creep) {
  let result = -20;

  if (shouldTransferEnergy(creep)) {
    creep.memory.task = WORK;
    let container = rememberLastContainer(creep);

    if (!container || container.store[RESOURCE_ENERGY] === container.storeCapacity) {
      container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: i => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] < i.storeCapacity,
      });
      rememberNewContainer(creep, container);
    }

    if (container) {
      result = creep.transfer(container, RESOURCE_ENERGY);
      if (result === ERR_NOT_IN_RANGE) {
        result = creep.moveTo(container);
      }
    }
  }
  return result;
}

export function transferEnergyToNearestStorage(creep: Creep) {
  let result = -20;

  if (shouldTransferEnergy(creep)) {
    creep.memory.task = WORK;
    let storage = rememberLastStorage(creep);

    if (!storage || storage.store[RESOURCE_ENERGY] === storage.storeCapacity) {
      storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: i => i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] < i.storeCapacity,
      });
      rememberNewStorage(creep, storage);
    }

    if (storage) {
      result = creep.transfer(storage, RESOURCE_ENERGY);
      if (result === ERR_NOT_IN_RANGE) {
        result = creep.moveTo(storage);
      }
    }
  }
  return result;
}

export function upgradeRoomController(creep: Creep) {
  let result = -20;
  if (shouldTransferEnergy(creep)) {
    creep.memory.task = WORK;
    const controller = creep.room.controller;
    if (controller && (result = creep.upgradeController(controller)) === ERR_NOT_IN_RANGE) {
      result = creep.moveTo(controller);
    }
  }
  return result;
}

export function repairStructures(creep: Creep) {
  let result = -20;
  if (shouldTransferEnergy(creep)) {
    creep.memory.task = WORK;

    let structureToRepair = rememberLastRepair(creep);
    if (!structureToRepair || structureToRepair.hits === structureToRepair.hitsMax) {
      const myStructs = creep.room.find<Structure>(FIND_MY_STRUCTURES, {
        filter: object => object.hits < object.hitsMax,
      });
      if (myStructs.length > 0) {
        myStructs.sort((a, b) => a.hits - b.hits);
        structureToRepair = rememberNewRepair(creep, myStructs[0]);
      }
    }

    if (structureToRepair && structureToRepair.hits < structureToRepair.hitsMax) {
      result = repair(creep, structureToRepair);
      if (result === ERR_NOT_IN_RANGE) {
        result = moveTo(creep, structureToRepair);
      }
    } else {
      rememberNewRepair(creep, undefined);
    }
  }
  return result;
}

export function repairWalls(creep: Creep) {
  let result = -20;

  if (shouldTransferEnergy(creep)) {
    creep.memory.task = WORK;

    let structureToRepair = rememberLastRepair(creep);
    if (
      !structureToRepair ||
      structureToRepair.structureType !== STRUCTURE_WALL ||
      structureToRepair.hits > structureToRepair.hitsMax / 2
    ) {
      const walls = creep.room.find<Structure>(FIND_STRUCTURES, {
        filter: object =>
          (object.structureType === STRUCTURE_WALL || object.structureType === STRUCTURE_CONTAINER) &&
          object.hits < object.hitsMax / 3,
      });
      if (walls.length > 0) {
        walls.sort((a, b) => a.hits - b.hits);
        structureToRepair = rememberNewRepair(creep, walls[0]);
      }
    }

    if (structureToRepair && structureToRepair.hits < structureToRepair.hitsMax / 2) {
      if ((result = repair(creep, structureToRepair)) === ERR_NOT_IN_RANGE) {
        result = moveTo(creep, structureToRepair);
      }
    } else {
      rememberNewRepair(creep, undefined);
    }
  }
  return result;
}

export function buildStructures(creep: Creep) {
  let result = -20;
  if (shouldTransferEnergy(creep)) {
    creep.memory.task = WORK;
    let constructionSite = rememberLastConstructionSite(creep);

    if (!constructionSite) {
      constructionSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
      rememberNewConstructionSite(creep, constructionSite);
    }

    if (constructionSite) {
      if ((result = creep.build(constructionSite)) === ERR_NOT_IN_RANGE) {
        result = moveTo(creep, constructionSite);
      }
    } else {
      rememberNewConstructionSite(creep, undefined);
    }
  }
  return result;
}

export function repairRoads(creep: Creep) {
  let result = -20;
  if (shouldTransferEnergy(creep)) {
    creep.memory.task = WORK;

    let structureToRepair = rememberLastRepair(creep);
    if (
      !structureToRepair ||
      structureToRepair.structureType !== STRUCTURE_ROAD ||
      structureToRepair.hits > structureToRepair.hitsMax / 2
    ) {
      const roadParts = creep.room.find<Structure>(FIND_STRUCTURES, {
        filter: object => object.structureType === STRUCTURE_ROAD && object.hits < object.hitsMax / 3,
      });

      if (roadParts.length > 0) {
        roadParts.sort((a, b) => a.hits - b.hits);
        structureToRepair = rememberNewRepair(creep, roadParts[0]);
      }
    }

    if (structureToRepair && structureToRepair.hits < structureToRepair.hitsMax / 2) {
      result = repair(creep, structureToRepair);
      if (result === ERR_NOT_IN_RANGE) {
        result = moveTo(creep, structureToRepair);
      }
    } else {
      rememberNewRepair(creep, undefined);
    }
  }
  return result;
}

export function fillUpTower(creep: Creep) {
  let result = -20;
  if (shouldTransferEnergy(creep)) {
    creep.memory.task = WORK;

    let tower = rememberLastTower(creep);
    if (!tower || tower.energy === tower.energyCapacity) {
      const towers = creep.room.find<Structure>(FIND_STRUCTURES, {
        filter: object => object.structureType === STRUCTURE_TOWER && object.energy < object.energyCapacity,
      });
      if (towers.length > 0) {
        towers.sort((a, b) => a.hits - b.hits);
        tower = rememberNewTower(creep, towers[0]);
      }
    }

    if (tower && tower.energy < tower.energyCapacity) {
      result = creep.transfer(tower, RESOURCE_ENERGY);
      if (result === ERR_NOT_IN_RANGE) {
        result = creep.moveTo(tower);
      }
    } else {
      rememberNewTower(creep, undefined);
    }
  }
  return result;
}
