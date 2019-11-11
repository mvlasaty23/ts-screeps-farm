import {
  harvestEnergyFromNearestStorage,
  harvestEnergyFromNearestContainer,
  harvestNearestEnergySource,
} from 'strategy/resource.strategy';

import { fillUpTower, repairStructures, repairWalls, upgradeRoomController } from 'strategy/work.strategy';
import { respawn } from 'strategy/live.strategy';

export const engineerRole = {
  name: 'engineer',
  liveStrategy: respawn,
  workStrategies: [
    harvestEnergyFromNearestStorage,
    harvestEnergyFromNearestContainer,
    harvestNearestEnergySource,
    fillUpTower,
    repairStructures, // also finds walls?
    repairWalls,
    upgradeRoomController,
  ],
};
