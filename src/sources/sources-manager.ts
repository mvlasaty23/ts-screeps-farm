import { Config } from "./../config/config";
import { RoomManager } from "./../rooms/room-manager";

export namespace SourceManager {

    export var sources: Source[];
	export var sourceCount: number = 0;
	export var constructionSites: ConstructionSite[];
	export var consturctionSitesCount: number = 0;
	export var containers: StructureContainer[];

    export function loadSources() {
        this.sources = RoomManager.getFirstRoom().find(FIND_SOURCES_ACTIVE);
		this.sourceCount = _.size(this.sources);

		this.constructionSites = RoomManager.getFirstRoom().find(FIND_CONSTRUCTION_SITES);
		this.consturctionSitesCount = _.size(this.consturctionSitesCount);

		this.containers = RoomManager.getFirstRoom().find(FIND_STRUCTURES, {
			filter: (structure: Structure) => {
				return (structure.structureType == STRUCTURE_CONTAINER);
			}
		});

        if (Config.VERBOSE) {
            console.log(this.sourceCount + " sources in room.");
        }
    }

    export function getFirstSource(): Source {
        return this.sources[0];
	}

	export function getFirstConstructionSite(): ConstructionSite {
		return this.constructionSites[0];
	}

	export function getFirstController(): Controller {
		return RoomManager.getFirstRoom().controller;
	}

	export function getFirstContainer(): StructureContainer {
		return this.containers[0];
	}

}
