import { RoomController } from 'controller/room.controller';

Room.prototype.roomController = function() {
  if(this._roomController === undefined) {
    if(this.controller && this.controller.my) { // TODO: wtf is controller?
      this._roomController = new RoomController(this);
    } else {
      this._roomController = undefined;
    }
  }
  return this._roomController;
}

// FIXME: use Memory instead of room.memory?
// Room.prototype.getSpawnStrategy = function() {
//   // get strategy by rcLevel
//   const rcStrategies = this.memory.spawnStrategy[this.controller.level] || {};
//   // get spawn strategy by energyCapa
//   // TODO: wrapp rcStrategies in a class to calculate or get the strategy
//   // const spawnStrategy = ;
// }
