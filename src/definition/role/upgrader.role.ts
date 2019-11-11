import { respawn } from 'strategy/live.strategy';

import {
  harvestEnergyFromNearestContainer,
  harvestEnergyFromNearestStorage,
  harvestNearestEnergySource,
} from 'strategy/resource.strategy';

import { upgradeRoomController } from 'strategy/work.strategy';

export const upgraderRole = {
  name: 'upgrader',
  liveStrategy: respawn,
  workStrategies: [
    harvestEnergyFromNearestContainer,
    harvestEnergyFromNearestStorage,
    harvestNearestEnergySource,
    upgradeRoomController,
  ],
};
