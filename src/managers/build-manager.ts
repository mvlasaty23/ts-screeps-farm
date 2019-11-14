import { RoomManager } from "./room-manager";
import { SpawnManager } from "./spawn-manager";
import { TowerManager } from "./tower-manager";
import { ConfigManager } from "./config-manager";
import { SourceManager } from "./sources-manager";

export interface ICoordinates {
	x: number, y: number
}

// positions.push(new RoomPosition(spawn.pos.x, spawn.pos.y, roomName))
export namespace BuildManager {

	export function run() {
		// built extensions on free spots around the spawn#
		let constructedAndPlannedExtensionsCount = SpawnManager.getExtensionsLength();
		constructedAndPlannedExtensionsCount += SpawnManager.getPlannedExtensionsLength();
		if (constructedAndPlannedExtensionsCount < ConfigManager.getNeedetExtensionsCount()){
			const spawn = SpawnManager.getFirstSpawn();
			if (SourceManager.getFirstController().level < 4) {
				const freePositions = getFreePositionsAround(spawn.pos, 4);
				built(freePositions, STRUCTURE_EXTENSION);
			} else {
				const freePositions = getFreePositionsAround(spawn.pos, 7);
				built(freePositions, STRUCTURE_EXTENSION);
			}
			SpawnManager.getFirstSpawn().memory.controllerUpgradet = false;
		} else {
			// built containers
			if (SourceManager.getContainerLength() < 5) {
				built(generateContainers(), STRUCTURE_CONTAINER);
				SpawnManager.getFirstSpawn().memory.controllerUpgradet = false;
			} else if (SpawnManager.getFirstSpawn().memory.controllerUpgradet) {
				built(generateControllerRoads(), STRUCTURE_ROAD);
				built(generateRoads(), STRUCTURE_ROAD);
				built(generateTower(), STRUCTURE_TOWER);
				built(generateStorage(), STRUCTURE_STORAGE);
				SpawnManager.getFirstSpawn().memory.controllerUpgradet = false;
			}
		}
	}

	export function built(positions: RoomPosition[], structureType: string) {
		positions.forEach(pos => {
			const terrain = pos.lookFor(LOOK_TERRAIN);
			if (terrain.indexOf("wall") == -1) {
				if (pos.createConstructionSite(structureType) == OK) {
					console.log("Builded " + structureType + " x:" + pos.x + " y:" + pos.y);
				}
			}
		});
	}

	export function generateContainers(): RoomPosition[] {
		const positions: RoomPosition[] = [];
		const sources = SourceManager.getAllSource();
		const roomName = RoomManager.getFirstRoomName();
		const ratio = 1;

		let positionCont = 0;
		sources.forEach(source => {
			const position = new RoomPosition(source.pos.x, source.pos.y - ratio, roomName);
			if (isPositionEmpty(position)) {
				positions.push(position);
				positionCont++;
			}
			const position2 = new RoomPosition(source.pos.x - ratio, source.pos.y, roomName);
			if (isPositionEmpty(position2)) {
				positions.push(position2);
				positionCont++;
			}
			const position3 = new RoomPosition(source.pos.x - ratio, source.pos.y - ratio, roomName);
			if (isPositionEmpty(position3)) {
				positions.push(position3);
				positionCont++;
			}
			if (positionCont == 3) {
				return;
			}
			const position4 = new RoomPosition(source.pos.x, source.pos.y + ratio, roomName);
			if (isPositionEmpty(position4)) {
				positions.push(position4);
				positionCont++;
			}
			if (positionCont == 3) {
				return;
			}
			const position5 = new RoomPosition(source.pos.x + ratio, source.pos.y, roomName);
			if (isPositionEmpty(position5)) {
				positions.push(position5);
				positionCont++;
			}
			if (positionCont == 3) {
				return;
			}
			const position6 = new RoomPosition(source.pos.x + ratio, source.pos.y + ratio, roomName);
			if (isPositionEmpty(position6)) {
				positions.push(position6);
				positionCont++;
			}
			if (positionCont == 3) {
				return;
			}
			const position7 = new RoomPosition(source.pos.x - ratio, source.pos.y + ratio, roomName);
			if (isPositionEmpty(position7)) {
				positions.push(position7);
				positionCont++;
			}
			if (positionCont == 3) {
				return;
			}
			const position8 = new RoomPosition(source.pos.x + ratio, source.pos.y - ratio, roomName);
			if (isPositionEmpty(position8)) {
				positions.push(position8);
				positionCont++;
			}
		});

		return positions;
	}

	export function generateStorage(): RoomPosition[] {
		const positions: RoomPosition[] = [];
		const spawnPos = SpawnManager.getFirstSpawn().pos;
		const roomName = RoomManager.getFirstRoomName();
		if (RoomManager.getStorage() == undefined) {
			// check 4 possible positions
			let pos = new RoomPosition(spawnPos.x - 5, spawnPos.y + 1, roomName);
			if (isPositionEmpty(pos)) {
				positions.push(pos);
				return positions;
			}
			let pos2 = new RoomPosition(spawnPos.x - 5, spawnPos.y - 1, roomName);
			if (isPositionEmpty(pos2)) {
				positions.push(pos2);
				return positions;
			}
			let pos3 = new RoomPosition(spawnPos.x + 1, spawnPos.y - 5, roomName);
			if (isPositionEmpty(pos3)) {
				positions.push(pos3);
				return positions;
			}
			let pos4 = new RoomPosition(spawnPos.x - 1, spawnPos.y - 5, roomName);
			if (isPositionEmpty(pos4)) {
				positions.push(pos4);
				return positions;
			}
		}
		return positions;
	}

	function generateTower(): RoomPosition[] {
		let positions: RoomPosition[] = [];
		const spawn = SpawnManager.getFirstSpawn();
		const roomName = RoomManager.getFirstRoomName();
		if (TowerManager.getTowers().length <= 0) {
			positions.push(new RoomPosition(spawn.pos.x - 5, spawn.pos.y + 1, roomName));
		}
		return positions;
	}

	function getFreePositionsAround(startPosition: RoomPosition, ratio: number): RoomPosition[] {
		let positions: RoomPosition[] = [];
		const roomName = RoomManager.getFirstRoomName();

		// top left corner
		for (let x = startPosition.x; x > startPosition.x - ratio; x--) {
			for (let y = startPosition.y; y > startPosition.y - ratio; y--) {
				const pos = new RoomPosition(x, y, roomName);
				// terrain contains plain + structures is empty
				if (isPositionEmpty(pos)) {
					// console.log(JSON.stringify(pos), terrain, structures, "top left");
					positions.push(pos);
				}
			}
		}

		// top right corner
		for (let x = startPosition.x; x < startPosition.x + ratio; x++) {
			for (let y = startPosition.y; y > startPosition.y - ratio; y--) {
				const pos = new RoomPosition(x, y, roomName);
				// terrain contains plain + structures is empty
				if (isPositionEmpty(pos)) {
					// console.log(JSON.stringify(pos), terrain, structures, "top right");
					positions.push(pos);
				}
			}
		}

		// bottom left corner
		for (let x = startPosition.x; x > startPosition.x - ratio; x--) {
			for (let y = startPosition.y; y < startPosition.y + ratio; y++) {
				const pos = new RoomPosition(x, y, roomName);
				// terrain contains plain + structures is empty
				if (isPositionEmpty(pos)) {
					// console.log(JSON.stringify(pos), terrain, structures, "bottom left");
					positions.push(pos);
				}
			}
		}

		// bottom right corner
		for (let x = startPosition.x; x < startPosition.x + ratio; x++) {
			for (let y = startPosition.y; y < startPosition.y + ratio; y++) {
				const pos = new RoomPosition(x, y, roomName);
				// terrain contains plain + structures is empty
				if (isPositionEmpty(pos)) {
					// console.log(JSON.stringify(pos), terrain, structures, "bottom right");
					positions.push(pos);
				}
			}
		}

		return positions;
	}

	function isPositionEmpty(pos: RoomPosition): boolean {
		const terrain = pos.lookFor(LOOK_TERRAIN);
		const structures = pos.lookFor(LOOK_STRUCTURES);
		const constructions = pos.lookFor(LOOK_CONSTRUCTION_SITES);

		// terrain contains plain + structures is empty
		if (terrain.indexOf("plain") != -1 && structures.length == 0 && constructions.length == 0) {
			// console.log(JSON.stringify(pos), terrain, structures, "top right");
			return true;
		}
		return false;
	}

	export function generateControllerRoads(): RoomPosition[] {
		const spawn = SpawnManager.getFirstSpawn();
		const firstRoom = RoomManager.getFirstRoom();

		const controller = SourceManager.getFirstController()
		controller.pos

		// North
		const northEdge = new RoomPosition(spawn.pos.x, spawn.pos.y - 7, firstRoom.name);
		const northPath = firstRoom.findPath(northEdge, controller.pos, { ignoreCreeps: true, ignoreRoads: true });
		const pathArray: [PathStep[]] = [northPath];
		console.log("northEdge: x:" + northEdge.x + " y:" + northEdge.y, northPath.length);
		// South
		const southEdge = new RoomPosition(spawn.pos.x, spawn.pos.y + 7, firstRoom.name);
		const southPath = firstRoom.findPath(southEdge, controller.pos, { ignoreCreeps: true, ignoreRoads: true });
		pathArray.push(southPath);
		console.log("southEdge: x:" + southEdge.x + " y:" + southEdge.y, southPath.length);
		// East
		const eastEdge = new RoomPosition(spawn.pos.x + 7, spawn.pos.y, firstRoom.name);
		const eastPath = firstRoom.findPath(eastEdge, controller.pos, { ignoreCreeps: true, ignoreRoads: true });
		pathArray.push(eastPath);
		console.log("eastEdge: x:" + eastEdge.x + " y:" + eastEdge.y, eastPath.length);
		// West
		const westEdge = new RoomPosition(spawn.pos.x - 7, spawn.pos.y, firstRoom.name);
		const westPath = firstRoom.findPath(westEdge, controller.pos, { ignoreCreeps: true, ignoreRoads: true });
		pathArray.push(westPath);
		console.log("westEdge: x:" + westEdge.x + " y:" + westEdge.y, westPath.length);

		let lowest = Number.POSITIVE_INFINITY;
		let highest = Number.NEGATIVE_INFINITY;
		let tmp: number;
		let shortestPath: PathStep[];
		for (var i=pathArray.length-1; i>=0; i--) {
			tmp = pathArray[i].length;
			if (tmp < lowest) {
				lowest = tmp;
				shortestPath = pathArray[i];
			};
			if (tmp > highest) highest = tmp;
		}

		let positions: RoomPosition[] = [];
		shortestPath.forEach((pathStep: PathStep) => {
			positions.push(new RoomPosition(pathStep.x, pathStep.y, firstRoom.name));
		});

		return positions;
	}

	function generateRoads(): RoomPosition[] {
		let positions: RoomPosition[] = [];
		const spawn = SpawnManager.getFirstSpawn();
		const roomName = RoomManager.getFirstRoomName();
		// around the spawn
		positions.push(new RoomPosition(spawn.pos.x -1, spawn.pos.y, roomName));
		positions.push(new RoomPosition(spawn.pos.x + 1, spawn.pos.y, roomName));
		positions.push(new RoomPosition(spawn.pos.x, spawn.pos.y - 1, roomName));
		positions.push(new RoomPosition(spawn.pos.x, spawn.pos.y + 1, roomName));
		positions.push(new RoomPosition(spawn.pos.x - 1, spawn.pos.y - 1, roomName));
		positions.push(new RoomPosition(spawn.pos.x - 1, spawn.pos.y + 1, roomName));
		positions.push(new RoomPosition(spawn.pos.x + 1, spawn.pos.y - 1, roomName));
		positions.push(new RoomPosition(spawn.pos.x + 1, spawn.pos.y + 1, roomName));


		// arme
		for (var i = 0; i < 8; i++) {
			// right arm
			positions.push(new RoomPosition(spawn.pos.x + i, spawn.pos.y, roomName));
			// left arm
			positions.push(new RoomPosition(spawn.pos.x - i, spawn.pos.y, roomName));
			// top arm
			positions.push(new RoomPosition(spawn.pos.x, spawn.pos.y - i, roomName));
			// bottom arm
			positions.push(new RoomPosition(spawn.pos.x, spawn.pos.y + i, roomName));

			// right top arm
			positions.push(new RoomPosition(spawn.pos.x + (2 + i), spawn.pos.y - (2 + i), roomName));
			// right bottom arm
			positions.push(new RoomPosition(spawn.pos.x + (2 + i), spawn.pos.y + (2 + i), roomName));
			// left top arm
			positions.push(new RoomPosition(spawn.pos.x - (2 + i), spawn.pos.y - (2 + i), roomName));
			// left top arm
			positions.push(new RoomPosition(spawn.pos.x - (2 + i), spawn.pos.y + (2 + i), roomName));
		}

		// geraden
		for (var i = 0; i < 7; i++) {
			// connect left top arm with right top arm
			positions.push(new RoomPosition((spawn.pos.x - 3) + i, spawn.pos.y - 4, roomName));
			// connect left bottom arm with right bottm arm
			positions.push(new RoomPosition((spawn.pos.x - 3) + i, spawn.pos.y + 4, roomName));
			// connect left top arm with left bottm arm
			positions.push(new RoomPosition(spawn.pos.x - 4, (spawn.pos.y - 3) + i, roomName));
			// connect right top arm with right bottm arm
			positions.push(new RoomPosition(spawn.pos.x + 4, (spawn.pos.y - 3) + i, roomName));
		}

		for (var i = 0; i < 13; i++) {
			// connect left top arm with right top arm
			positions.push(new RoomPosition((spawn.pos.x - 6) + i, spawn.pos.y - 7, roomName));
			// connect left bottom arm with right bottm arm
			positions.push(new RoomPosition((spawn.pos.x - 6) + i, spawn.pos.y + 7, roomName));
			// connect left top arm with left bottm arm
			positions.push(new RoomPosition(spawn.pos.x - 7, (spawn.pos.y - 6) + i, roomName));
			// connect right top arm with right bottm arm
			positions.push(new RoomPosition(spawn.pos.x + 7, (spawn.pos.y - 6) + i, roomName));
		}
		return positions;
	}
}
