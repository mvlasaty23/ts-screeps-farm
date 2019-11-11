import { transporterType } from './type/transporter.type';
import { minerType } from './type/miner.type';
import { supplierRole } from './role/supplier.role';
import { minerRole } from './role/miner.role';
import { carrierRole } from './role/carrier.role';
import { workerType } from './type/worker.type';
import { engineerType } from './type/engineer.type';
import { engineerRole } from './role/engineer.role';
import { upgraderRole } from './role/upgrader.role';
import { builderRole } from './role/builder.role';

export const creepDefs = [
  {
    name: 'supplier',
    type: transporterType,
    role: supplierRole,
    count: 2,
    description: 'Suppliers energy to extension, spawn',
  },
  { name: 'miner', type: minerType, role: minerRole, count: 2, description: 'Mines energy to container' },
  { name: 'carrier', type: transporterType, role: carrierRole, count: 2, description: 'Carries energy to storage' },
  { name: 'upgrader', type: workerType, role: upgraderRole, count: 2, description: 'Upgrades the room controller' },
  {
    name: 'builder',
    type: workerType,
    role: builderRole,
    count: 2,
    description: 'Builds new structs, repairs and upgrades',
  },
  { name: 'maintainer', type: engineerType, role: engineerRole, count: 2, description: 'Repairs structures and walls' },
];
