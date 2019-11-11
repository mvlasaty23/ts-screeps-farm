import { harvestEnergyFromNearestStorage, harvestEnergyFromNearestContainer } from 'strategy/resource.strategy';

import { buildStructures, repairStructures, repairRoads, upgradeRoomController } from 'strategy/work.strategy';
import { respawn } from 'strategy/live.strategy';

export const builderRole = {
  name: 'builder',
  liveStrategy: respawn,
  workStrategies: [
    harvestEnergyFromNearestStorage,
    harvestEnergyFromNearestContainer,
    buildStructures,
    repairStructures,
    repairRoads,
    upgradeRoomController,
  ],
};
