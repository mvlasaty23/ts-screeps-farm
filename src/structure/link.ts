export interface LinkInterface {
	transferEnergy(link: StructureLink, targetLink: StructureLink): void;
}

export class Link implements LinkInterface {
	public transferEnergy(link: StructureLink, targetLink: StructureLink): void {
		link.transferEnergy(targetLink);
	}
}
