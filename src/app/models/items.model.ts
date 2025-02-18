export interface Item {
    id: number;
    name: string;
    description: string;
    totalCost: number;
    ownerIds: number[];
    isShared?: boolean;
    hasPending?: boolean;
}
  