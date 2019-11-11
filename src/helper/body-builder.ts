import { SpawnManager } from "managers/spawn-manager";

export interface IBodyCalculationOptions {
	primaryPart: string;
	secondaryPart: string;
	thirdPart?: string;
	ratio: number
}

export namespace BodyBuilder {
	// const bodyPartCost = {
	// 	MOVE: 50,
	// 	WORK: 100,
	// 	CARRY: 50,
	// 	ATTACK: 80,
	// 	RANGED_ATTACK: 150,
	// 	HEAL: 250,
	// 	TOUGH: 10,
	// 	CLAIM: 600,
	// };

	export function generateBody(options: IBodyCalculationOptions): string[] {
		let result: string[] = [];

		const availableEnergy = SpawnManager.getEnergyAvailable();

		// let calculate = true;
		let tryCounter = 4;
		// while (calculate) {
			// for (var j = 0; j < tryCounter; j++) {
			// 	for (var i = 0; i < options.ratio; i++) {
			// 		result.push(options.primaryPart);
			// 		if (options.thirdPart) {
			// 			result.push(options.thirdPart)
			// 		}
			// 	}
			// 	result.push(options.secondaryPart);
			// }
		// 	if (calculateResultOfResult(result) <= availableEnergy) {
		// 		// console.log("completed", calculateResultOfResult(result), result);
		// 		calculate = false;
		// 	} else {
		// 		tryCounter--;
		// 		result = [];
		// 	}
		// 	if (tryCounter == 0) {
		// 		calculate = false;
		// 		result = [];
		// 	}
		// }


		for (var j = 0; j < tryCounter; j++) {
			for (var i = 0; i < options.ratio; i++) {
				result.push(options.primaryPart);
				if (options.thirdPart) {
					result.push(options.thirdPart)
				}
			}
			result.push(options.secondaryPart);
		}

		let energyCosts = calculateResultOfResult(result)
		if (energyCosts <= availableEnergy) {
			let calculate = true;
			while (calculate) {
				result.pop();
				if (energyCosts <= availableEnergy) {
					console.log("completed", energyCosts, result);
					calculate = false;
				}
			}
		}

		return result.sort();
	}

	function calculateResultOfResult(optionsResult: string[]): number {
		let result = 0;
		for (let i = 0; i < optionsResult.length; i++) {
			switch(optionsResult[i].toUpperCase()) {
				case "MOVE":
				case "CARRY":
					result += 50;
					break;
				case "WORK":
					result += 100;
					break;
				case "ATTACK":
					result += 80;
					break;
				case "RANGED_ATTACK":
					result += 150;
					break;
				case "HEAL":
					result += 250;
					break;
				case "TOUGH":
					result += 10;
					break;
				case "CLAIM":
					result += 600;
					break;
			}
		}
		return result;
	}

}
