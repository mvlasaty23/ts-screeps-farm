module.exports.loop = function() {

  Object.keys(Game.rooms)
  .map(roomName => Game.rooms[roomName])
  .map(room => room.brain()) // TODO: inject Memory here?
  .filter(brain => brain !== undefined)
  .forEach(brain => brain.execute());

  if(Game.time % 100 == 50) {
    forgetDeadCreeps(Memory.creeps, Game.creeps);
  }

  runCreepsStrategy(creepDefs, Game.creeps);
};


module.exports = [
  { name: 'supplier', type: transporterType, role: supplierRole, count: 2, description: 'Suppliers energy to extension, spawn'},
  { name: 'miner', type: minerType, role: minerRole, count: 2, description: 'Mines energy to container'},
  { name: 'carrier', type: transporterType, role: carrierRole, count: 2, description: 'Carries energy to storage'},
  { name: 'upgrader', type: workerType, role: upgraderRole, count: 2, description: 'Upgrades the room controller'},
  { name: 'builder', type: workerType, role: builderRole, count: 2, description: 'Builds new structs, repairs and upgrades'},
  { name: 'maintainer', type: engineerType, role: engineerRole, count: 2, description: 'Repairs structures and walls'},
];
