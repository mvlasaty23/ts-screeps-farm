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
    harvestEnergyFromNearestStorage,
    harvestEnergyFromNearestContainer,
    harvestNearestEnergySource,
    upgradeRoomController,
  ],
};

// query energyStrategies by rcLevel, spawner, sourceype order by priority
// const energyStrategyMap = [
// 	{
// 		rcLevel: 1,
// 		spawner: 1,
// 		sourceType: 1,
// 		priority: 1,
// 	}
// ];
