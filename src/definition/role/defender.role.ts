import { respawn } from 'strategy/live.strategy';

export const defenderRole = {
  name: 'defender',
  liveStrategy: respawn,
  workStrategies: [],
};
