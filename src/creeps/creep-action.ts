import {Config} from "./../config/config";
import { RoomManager } from "rooms/room-manager";

export interface CreepActionInterface {

    creep: Creep;
    renewStation: Spawn;
    minLifeBeforeNeedsRenew: number;

    setCreep(creep: Creep): void;
    /**
     * Wrapper for Creep.moveTo() method.
     */
    moveTo(target: RoomPosition|{pos: RoomPosition}, color: string): number;
    needsRenew(): boolean;
    tryRenew(): number;
    moveToRenew(): void;

    action(): boolean;
}

export class CreepAction implements CreepActionInterface {

    public creep: Creep = null;
    public renewStation: Spawn = null;

	public maxRenewCount: number = Config.DEFAULT_MAX_RENEW_COUNT;
	public minLifeBeforeNeedsRenew: number = Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL;
	public maxLifeUntilRefillComplete: number = Config.DEFAULT_MAX_LIFE_UNTIL_REFILL_COMPLETE;

    public setCreep(creep: Creep) {
        this.creep = creep;
        this.renewStation = <Spawn>Game.getObjectById(this.creep.memory.renew_station_id);
    }

    public moveTo(target: RoomPosition|{pos: RoomPosition}, color: string) {
        return this.creep.moveTo(target, {visualizePathStyle: {stroke: color}});
    }

    public needsRenew(): boolean {
		let needsRenew = (this.creep.ticksToLive < this.minLifeBeforeNeedsRenew);
		if (needsRenew || this.creep.memory.renewInProgress) {
			this.creep.memory.renewInProgress = true;
			if (this.creep.ticksToLive > this.maxLifeUntilRefillComplete) {
				this.creep.memory.renewInProgress = false;
				return false;
			}
			return true;
		}
		return false;
	}

	public incraseRenewCount() {
		RoomManager.getFirstRoom().memory.renewCount = RoomManager.getFirstRoom().memory.renewCount + 1;
		console.log(RoomManager.getFirstRoom().memory.renewCount);
	}
	public decraseRenewCount() {
		RoomManager.getFirstRoom().memory.renewCount = RoomManager.getFirstRoom().memory.renewCount - 1;
		console.log(RoomManager.getFirstRoom().memory.renewCount);
	}

    public tryRenew(): number {
		this.creep.say('♻️');
        return this.renewStation.renewCreep(this.creep);
    }

    public moveToRenew(): void {
        if (this.tryRenew() == ERR_NOT_IN_RANGE) {
            this.moveTo(this.renewStation, "#008000");
        }
    }

    public action(): boolean {
        return true;
    }
}
