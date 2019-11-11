import { CreepManager } from 'managers/creep-manager';
import { TowerManager } from 'managers/tower-manager';
import { BuildManager } from 'managers/build-manager';
import { EventManager } from 'managers/event-manager';
import { LinkManager } from 'managers/link-manager';
import { RoomController } from "controller/room.controller";
import { creepDefs, CreepDefinition } from "definition/creep.definition";

export function loop() {
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
  runCreepsStrategy(creepDefs, Game.creeps);
}

function forgetDeadCreeps(creepsInMemory: { [name: string]: any }, creepsInGame: { [creepName: string]: Creep }) {
  if (creepsInMemory) {
    Object.keys(creepsInMemory)
      .filter(index => !creepsInGame[index])
      .forEach(index => delete creepsInMemory[index]);
	}
}

function executeStrategies(creep: Creep, strategies: any[]) {
  strategies.find(strategy => {
    let result = -20;
    try {
      result = strategy(creep);
      // console.log(`Running ${creep.name} ${strategy.name} ${result}`);
    } catch(e) {
      console.log(`Cannot run ${creep.name} ${strategy.name}`, e.stack);
    }
    if(result === OK || result === ERR_TIRED) {
      // console.log(`Running ${creep.name} ${strategy.name} ${result}`);
      creep.memory.executingStrategy = strategy.name;
      return true;
    } else {
      creep.memory.executingStrategy = undefined;
      return false;
    }
  });
  // console.log(`Executing ${creep.memory.executingStrategy}`);
  return creep.memory.executingStrategy;
}

function creepsByType(livingCreeps: { [creepName: string]: Creep; }) {
  return (def) => ({
    def,
    creeps: Object.keys(livingCreeps).map(key => livingCreeps[key]).filter(creep => creep.memory.role === def.role.name),
  });
}

function creepsNotRenewing({def, creeps}) {
  return({
    def,
    creeps: creeps.filter(creep => def.role.liveStrategy(creep)),
  });
}

function runStrategies(workStrategies) {
  return (creep) => executeStrategies(creep, workStrategies);
}

function runAllCreeps({def, creeps}) {
  creeps.forEach(runStrategies(def.role.workStrategies));
}

function runCreepsStrategy(creepDefss: CreepDefinition[], livingCreeps: { [creepName: string]: Creep; }) {
  creepDefss
  .map(creepsByType(livingCreeps))
  .map(creepsNotRenewing)
  .forEach(runAllCreeps);
}
