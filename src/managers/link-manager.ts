import { Link } from "structure/link";

export namespace LinkManager {
	export function run() {
		const linkStructure = Game.getObjectById<StructureLink>("596c53114925246");
		const targetLinkStructure = Game.getObjectById<StructureLink>("d75e570aa5423e6");
		if (linkStructure.energy > 0) {
			const link = new Link();
			link.transferEnergy(linkStructure, targetLinkStructure);
		}
	}
}
