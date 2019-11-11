import { respawn } from 'strategy/live.strategy';

import { harvestNearestEnergySource } from 'strategy/resource.strategy';

import { transferEnergyToNearestContainer } from 'strategy/work.strategy';

export const minerRole = {
  name: 'miner',
  liveStrategy: respawn,
  workStrategies: [
    harvestNearestEnergySource,
    // harvestEnergyFromNearestStorage,
    transferEnergyToNearestContainer,
    // transferEnergyToNearestSpawnerExtension,
    // transferEnergyToInitialSpawner,
    // upgradeRoomController,
    // buildStructures,
  ],
};
