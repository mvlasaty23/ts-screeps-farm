import { respawn } from 'strategy/live.strategy'
import { harvestEnergyFromNearestContainer, harvestNearestEnergySource } from 'strategy/resource.strategy'
import {
  transferEnergyToNearestSpawnerExtension,
  transferEnergyToNearestStorage,
  upgradeRoomController,
} from 'strategy/work.strategy'

export const carrierRole = {
  name: 'carrier',
  liveStrategy: respawn,
  workStrategies: [
    harvestEnergyFromNearestContainer,
    harvestNearestEnergySource,
    transferEnergyToNearestSpawnerExtension,
    transferEnergyToNearestStorage,
    upgradeRoomController,
  ],
}
