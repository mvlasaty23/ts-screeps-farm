import { CreepManager } from 'managers/creep-manager';
import { TowerManager } from 'managers/tower-manager';
import { BuildManager } from 'managers/build-manager';
import { EventManager } from 'managers/event-manager';
import { LinkManager } from 'managers/link-manager';
import { RoomController } from "controller/room.controller";

export function loop() {
  // console.log("running!!");
  Object.keys(Game.rooms)
    .map(roomName => Game.rooms[roomName])
    .map(room => new RoomController(room)) // TODO: inject Memory here?
    .filter(roomController => roomController)
    .forEach(roomController => roomController.execute());

	EventManager.run();
	CreepManager.run();
    TowerManager.run();
	BuildManager.run();
	LinkManager.run();
    
  if (Game.time % 100 === 50) {
    forgetDeadCreeps(Memory.creeps, Game.creeps);
  }
}

function forgetDeadCreeps(creepsInMemory: { [name: string]: any }, creepsInGame: { [creepName: string]: Creep }) {
  if (creepsInMemory) {
    Object.keys(creepsInMemory)
      .filter(index => !creepsInGame[index])
      .forEach(index => delete creepsInMemory[index]);
  }
}