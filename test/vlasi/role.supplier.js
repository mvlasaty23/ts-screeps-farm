const liveStrategy = require('strategy.live');
const resourceStrategy = require('strategy.resource');
const workStrategy = require('strategy.work');

module.exports = {
  name: 'supplier',
  liveStrategy: liveStrategy.respawn,
  workStrategies: [
    resourceStrategy.harvestEnergyFromNearestStorage,
    resourceStrategy.harvestEnergyFromNearestContainer,
    resourceStrategy.harvestNearestEnergySource,
    workStrategy.transferEnergyToNearestSpawnerExtension,
    workStrategy.transferEnergyToInitialSpawner,
    workStrategy.upgradeRoomController,
  ],
};
