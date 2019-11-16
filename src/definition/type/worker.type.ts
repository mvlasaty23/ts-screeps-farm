export const workerType = {
  name: 'worker',
  body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE/*WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE*/], // TODO: refactor to be a function (spwaner) => boolean
  priority: 1,
};
