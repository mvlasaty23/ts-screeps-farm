import { respawn } from 'strategy/live.strategy';

import { harvestEnergyFromNearestContainer, harvestNearestEnergySource } from 'strategy/resource.strategy';

import { transferEnergyToNearestStorage } from 'strategy/work.strategy';

export const carrierRole = {
  name: 'carrier',
  liveStrategy: respawn,
  workStrategies: [
    harvestEnergyFromNearestContainer,
    harvestNearestEnergySource,
    // transferEnergyToNearestSpawnerExtension,
    // transferEnergyToInitialSpawner,
    transferEnergyToNearestStorage,
  ],
};
