import { respawn } from 'strategy/live.strategy';

import {
  harvestEnergyFromNearestStorage,
  harvestEnergyFromNearestContainer,
  harvestNearestEnergySource,
} from 'strategy/resource.strategy';

import {
  transferEnergyToNearestSpawnerExtension,
  transferEnergyToInitialSpawner,
  upgradeRoomController,
} from 'strategy/work.strategy';

export const supplierRole = {
  name: 'supplier',
  liveStrategy: respawn,
  workStrategies: [
		harvestEnergyFromNearestStorage,
    harvestEnergyFromNearestContainer,
    harvestNearestEnergySource,
    transferEnergyToNearestSpawnerExtension,
    transferEnergyToInitialSpawner,
    upgradeRoomController,
  ],
};
