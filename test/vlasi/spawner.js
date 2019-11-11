const bodyPartCost = {
	move: 50,
	work: 100,
	carry: 50,
	attack: 80,
	ranged_attack: 150,
	heal: 250,
	tough: 10,
	claim: 600,
  };

  const calcOptions = {
	primaryPart: WORK,
	secondaryPart: CARRY,
	moveRatio: 2,
	spawn: undefined,
  };

  class BodyBuilder {
	constructor(options) {
	  this.primaryPart = options.primaryPart;
	  this.secondaryPart = options.secondaryPart;
	  this.moveRatio = options.moveRatio;
	  this.maxEnergy = options.spawn.energyCapacity;
	  this.primaryCost = bodyPartCost[this.primaryPart];
	  this.secondaryCost = bodyPartCost[this.primaryPart];
	  this.moveCost = bodyPartCost[MOVE];

	  this.energy = moveCost;
	  this.bodyParts = [MOVE];
	}
	addPart(part) {
	  this.bodyParts.push(part);
	  this.energy += bodyPartCost[part];
	}
	canAdd(part) {
	  return (this.energy + bodyPartCost[part]) < this.maxEnergy;
	}
	build() {
	  while(this.energy < (this.maxEnergy - this.moveCost)) {
		const addPrimary = this.canAdd(this.primaryPart);
		if(addPrimary) {
		  this.addPart(this.primaryPart);
		}

		const primaryParts = this.bodyParts.filter(part => part === this.primaryPart).length;
		const moveParts = this.bodyParts.filter(part => part === MOVE).length;
		if((primaryParts - moveParts) >= this.moveRatio && this.canAdd(MOVE)) {
		  this.addPart(MOVE);
		}

		const addSecondary = this.canAdd(this.secondaryPart);
		if(addSecondary) {
		  this.addPart(this.secondaryPart);
		}

		if(addPrimary === false && addSecondary === false) {
		  break;
		}
	  }
	  return bodyParts;
	}
  }
  function calculateBody(bodyOptions) {
	const maxEnergy = bodyOptions.spawn.energyCapacity;
	const primaryCost = bodyPartCost[bodyOptions.primaryPart];
	const secondaryCost = bodyPartCost[bodyOptions.primaryPart];
	const moveCost = bodyPartCost[MOVE];
	let energy = moveCost;
	let bodyParts = [MOVE]; // each creep has per default 1 move part
	function addBodyPart(part, cost) {
	  bodyParts.push(part);
	  energy += cost;
	}

	while(energy < (maxEnergy - moveCost)) {
	  const addPrimary = (energy + primaryCost) < maxEnergy;
	  if(addPrimary) {
		addBodyPart(bodyOptions.primaryPart, primaryCost);
	  }

	  const primaryParts = bodyParts.filter(part => part === bodyOptions.primaryPart).length;
	  const moveParts = bodyParts.filter(part => part === MOVE).length;
	  if((primaryParts - moveParts) >= bodyOptions.moveRatio && (energy + moveCost) < maxEnergy) {
		addBodyPart(MOVE, moveCost);
	  }

	  const addSecondary = (energy + secondaryCost) < maxEnergy;
	  if(addSecondary) {
		addBodyPart(bodyOptions.secondaryPart, secondaryCost);
	  }

	  if(addPrimary === false && addSecondary === false) {
		break;
	  }
	}
	return bodyParts;
  }

  function spawnCreepWithGameTime(spawn) {
	return (creepDef) => {
	  const name = `${creepDef.type.name}-${creepDef.role.name}-${Game.time}`;
	  return spawn.spawnCreep(creepDef.type.body, name, {
		memory: {
		  type: creepDef.type.name,
		  role: creepDef.role.name,
		  initialSpawn: spawn.name,
		},
	  });
	}
  }

  function creepByTypeAndRole({role, type}) {
	return ({memory}) => memory.role === role.name && memory.type === type.name;
  }

  function firstSpawningCreep(spawn, livingCreeps) {
	return (creepDef) => {
	  let didSpawn = false;
	  const creeps = livingCreeps.filter(creepByTypeAndRole(creepDef));
	  if(creeps.length < creepDef.count || creepDef.count === -1) {
		const result = spawnCreepWithGameTime(spawn)(creepDef);
		didSpawn = result === OK || result === ERR_NOT_ENOUGH_ENERGY;
	  }
	  return didSpawn;
	};
  }

  function spawnCreepsByCountOrdered(creepDefs, spawn, livingCreeps) {
	return creepDefs.find(firstSpawningCreep(spawn, livingCreeps));
  }
  module.exports.spawnCreepsByCountOrdered = spawnCreepsByCountOrdered;
  module.exports.BodyBuilder  = BodyBuilder;
