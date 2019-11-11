import { builderRole } from './role/builder.role';
import { carrierRole } from './role/carrier.role';
import { engineerRole } from './role/engineer.role';
import { minerRole } from './role/miner.role';
import { supplierRole } from './role/supplier.role';
import { upgraderRole } from './role/upgrader.role';
import { engineerType } from './type/engineer.type';
import { minerType } from './type/miner.type';
import { transporterType } from './type/transporter.type';
import { workerType } from './type/worker.type';

export interface CreepDefinition {
  name: string;
  type: any;
  role: any;
  count: number;
  description: string;
}

export const creepDefs = [
  {
    name: 'supplier',
    type: transporterType,
    role: supplierRole,
    count: 1,
    description: 'Suppliers energy to extension, spawn',
  },
  { name: 'miner', type: minerType, role: minerRole, count: 1, description: 'Mines energy to container' },
  { name: 'carrier', type: transporterType, role: carrierRole, count: 0, description: 'Carries energy to storage' },
  { name: 'upgrader', type: workerType, role: upgraderRole, count: 1, description: 'Upgrades the room controller' },
  {
    name: 'builder',
    type: workerType,
    role: builderRole,
    count: 1,
    description: 'Builds new structs, repairs and upgrades',
  },
  { name: 'maintainer', type: engineerType, role: engineerRole, count: 0, description: 'Repairs structures and walls' },
];
