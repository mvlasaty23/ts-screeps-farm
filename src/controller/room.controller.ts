import { SpawnController } from './structure/spawn.controller';
import { creepDefs } from 'definition/creep.definition';

export class RoomController {
  private spawnController: SpawnController;
  private towers: Tower[];

  constructor(private room: Room) {
    this.spawnController = new SpawnController(this.room);
    this.towers = this.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
  }

  public execute() {
    this.executeTowerStrategy();
    this.spawnCreeps();
  }

  private spawnCreeps() {
    // Get spawn strategy by rcLevel and room.energyCapacity
    // calculate if rc level or energy capacity has changed
    // const strategy = this.getSpawnStrategy(); // TODO: initialize with getStrategy
    this.spawnController.spawnCreepsByCount(creepDefs);
  }

  private executeTowerStrategy() {
    this.towers.forEach(tower => {
      const target = tower.pos.findClosestByRange<Creep>(FIND_HOSTILE_CREEPS);
      if (target) {
        tower.attack(target);
      }
    });
  }
}
