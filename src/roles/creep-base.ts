import { SpawnManager } from "managers/spawn-manager";
import { RoomManager } from "managers/room-manager";
import { Roles } from "enums/roles";
import { SourceManager } from "managers/sources-manager";

export interface CreepBaseInterface {
	setEnergyDropOffId(creep: Creep): void;
	isBagEmpty(creep: Creep): boolean;
	isBagFull(creep: Creep): boolean;
    moveTo(creep: Creep, target: RoomPosition|{pos: RoomPosition}, color: string): number;
    action(creep: Creep): boolean;
}

export class CreepBase implements CreepBaseInterface {

	public setEnergyPickupIds(creep: Creep): void {
		const container: StructureContainer = SourceManager.getNearestContainer(creep.pos);
		const storage: StructureStorage = RoomManager.getStorage().store.energy > 50 ? RoomManager.getStorage() : undefined;
		const droppedResource: Resource = creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);
		const link: StructureLink = Game.getObjectById<StructureLink>("d75e570aa5423e6").energy > 50 ? Game.getObjectById<StructureLink>("d75e570aa5423e6") : undefined;

		switch (creep.memory.role) {
			case Roles.Builder:
				// STRUCTURE_CONTAINER
				// STRUCTURE_STORAGE
				// FIND_DROPPED_RESOURCES
				if (container) {
					creep.memory.energyPickupId = container.id;
				} else if (storage) {
					creep.memory.energyPickupId = storage.id;
				} else if (droppedResource) {
					creep.memory.energyPickupId = droppedResource.id;
				}
				break;
			case Roles.Carry:
				// FIND_DROPPED_RESOURCES
				// STRUCTURE_CONTAINER
				if (droppedResource) {
					creep.memory.energyPickupId = droppedResource.id;
				} else if (container) {
					creep.memory.energyPickupId = container.id;
				}
				break;
			case Roles.Maintainer:
				// STRUCTURE_CONTAINER
				// STRUCTURE_STORAGE
				if (container) {
					creep.memory.energyPickupId = container.id;
				} else if (storage) {
					creep.memory.energyPickupId = storage.id;
				}
				break;
			case Roles.Upgrader:
				// STRUCTURE_LINK
				// STRUCTURE_CONTAINER
				// STRUCTURE_STORAGE
				// FIND_DROPPED_RESOURCES
				if (link) {
					creep.memory.energyPickupId = link.id;
				} else if (container) {
					creep.memory.energyPickupId = container.id;
				} else if (storage) {
					creep.memory.energyPickupId == storage;
				} else if (droppedResource) {
					creep.memory.energyPickupId == droppedResource;
				}
				break;
		}
	}

	setEnergyDropOffId(creep: Creep): void {
		const constructionSite = creep.pos.findClosestByPath<ConstructionSite>(FIND_CONSTRUCTION_SITES);
		const spawn = SpawnManager.getFirstSpawn()["store"].getFreeCapacity(RESOURCE_ENERGY) == 0 ? undefined : SpawnManager.getFirstSpawn();
		const extension = creep.pos.findClosestByPath<StructureExtension>(FIND_STRUCTURES, {
			filter: (structure: Structure) => {
				return (structure.structureType == STRUCTURE_EXTENSION) &&
					structure["store"].getFreeCapacity(RESOURCE_ENERGY) > 0;
			}
		});
		const tower: StructureTower = creep.pos.findClosestByPath<StructureTower>(FIND_STRUCTURES, {
			filter: (structure: Structure) => {
				return (structure.structureType == STRUCTURE_TOWER) &&
					structure["store"].getFreeCapacity(RESOURCE_ENERGY) > 0;
			}
		});
		const storage: StructureStorage = creep.pos.findClosestByPath<StructureStorage>(FIND_STRUCTURES, {
			filter: (structure: Structure) => {
				return (structure.structureType == STRUCTURE_STORAGE) &&
					structure["store"].getFreeCapacity(RESOURCE_ENERGY) > 0;
			}
		});
		const link: StructureLink = creep.pos.findClosestByPath<StructureLink>(FIND_STRUCTURES, {
			filter: (structure: Structure) => {
				return (structure.structureType == STRUCTURE_LINK) &&
					structure["store"].getFreeCapacity(RESOURCE_ENERGY) > 0;
			}
		});


		switch (creep.memory.role) {
			case Roles.Builder:
				// FIND_CONSTRUCTION_SITES;
				if (constructionSite) {
					creep.memory.energyDropOffId = constructionSite.id;
				}
				break;
			case Roles.Carry:
				// STRUCTURE_SPAWN
				// STRUCTURE_EXTENSION
				// STRUCTURE_TOWER
				// STRUCTURE_STORE
				// STRUCTURE_LINK
				if (spawn) {
					creep.memory.energyDropOffId = spawn.id;
				} else if (extension) {
					creep.memory.energyDropOffId = extension.id;
				} else if (tower) {
					creep.memory.energyDropOffId = tower.id;
				} else if (storage) {
					creep.memory.energyDropOffId = storage.id;
				} else if (link) {
					creep.memory.energyDropOffId = link.id;
				}
				break;
			case Roles.Maintainer:
				const repairObject = creep.pos.findClosestByPath<Structure>(FIND_STRUCTURES, {
					filter: (object: Structure) => (object.hits < object.hitsMax)
						&& (object.structureType == STRUCTURE_CONTAINER
							|| object.structureType == STRUCTURE_ROAD
							|| object.structureType == STRUCTURE_STORAGE
							|| object.structureType == STRUCTURE_TOWER
							|| object.structureType == STRUCTURE_SPAWN)
				});
				// Object to repair
				if (repairObject) {
					creep.memory.energyDropOffId = repairObject.id;
				}
				break;
			case Roles.Upgrader:
				// Controller
				creep.memory.energyDropOffId = RoomManager.getFirstRoom().controller.id;
				break;
			case Roles.Miner:
				// FIND_SOURCES_ACTIVE
				const source = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE)
				if (source) {
					creep.memory.sourceId = source.id;
				}
		}
	}

	public isBagEmpty(creep: Creep): boolean {
		return (creep.carry.energy == 0);
	}

	public isBagFull(creep: Creep): boolean {
		return (creep.carry.energy == creep.carryCapacity);
	}

	public getBagUsedCapacity(creep: Creep): number {
		return creep.carry.energy;
	}

    public moveTo(creep: Creep, target: RoomPosition|{pos: RoomPosition}, color: string) {
        return creep.moveTo(target, {visualizePathStyle: {stroke: color}});
    }
    public action(creep: Creep): boolean {
		this.checkIfTargetIsObsolete(creep);

		let hostiles = RoomManager.detectHostiles();
		if (hostiles.length > 0 && creep.body.find(x => x.type == ATTACK)) {
			// attack
			if (creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE) {
				this.moveTo(creep, hostiles[0], "#FF0000");
			}
			// return true to break execution after
			return true;
		} else if (["7822c3309624766"].indexOf(creep.id) > -1) { // kill creep
			creep.say("🧟‍♂️");
			if (SpawnManager.getFirstSpawn().recycleCreep(creep) == ERR_NOT_IN_RANGE) {
				this.moveTo(creep, SpawnManager.getFirstSpawn().pos, "#FF0000");
			}
			return true;
		}

        return false;
    }

	private checkIfTargetIsObsolete(creep: Creep) {
		if ((creep.memory.role == Roles.Builder
			|| creep.memory.role == Roles.Carry
			|| creep.memory.role == Roles.Maintainer
			|| creep.memory.role == Roles.Upgrader) && !creep.memory.energyPickupId) {
			this.setEnergyPickupIds(creep);
			console.log("setEnergyPickupIds", creep.name, creep.memory.role);
		} else {
			const target = Game.getObjectById<Structure | Resource>(creep.memory.energyPickupId);
			if (!target) {
				this.setEnergyPickupIds(creep);
			} else if (target instanceof Structure) {
				if ((target as Structure)["store"].getCapacity(RESOURCE_ENERGY) < 50) {
					this.setEnergyPickupIds(creep);
				}
			}
		}

		if ((creep.memory.role == Roles.Miner && !creep.memory.sourceId)
			|| ((creep.memory.role == Roles.Builder
				|| creep.memory.role == Roles.Carry
				|| creep.memory.role == Roles.Maintainer
				|| creep.memory.role == Roles.Upgrader)
					&& !creep.memory.energyDropOffId)) {
			this.setEnergyDropOffId(creep);
			console.log("setEnergyDropOffId", creep.name, creep.memory.role);
		} else {
			const target = Game.getObjectById<StructureSpawn | StructureExtension | StructureTower | StructureStorage | Resource>(creep.memory.energyDropOffId);
			if (!target) {
				this.setEnergyDropOffId(creep);
			} else if (target instanceof StructureSpawn) {
				if ((target as StructureSpawn)["store"].getFreeCapacity(RESOURCE_ENERGY) == 0) {
					this.setEnergyDropOffId(creep);
				}
			} else if (target instanceof StructureExtension) {
				if ((target as StructureExtension)["store"].getFreeCapacity(RESOURCE_ENERGY) == 0) {
					this.setEnergyDropOffId(creep);
				}
			} else if (target instanceof StructureTower) {
				if ((target as StructureTower)["store"].getFreeCapacity(RESOURCE_ENERGY) < 500) {
					this.setEnergyDropOffId(creep);
				}
			} else if (target instanceof StructureStorage) {
				// check if other available
				this.setEnergyDropOffId(creep);
			}
		}
	}
}
