import { User } from "./user.model";

export interface Proposal {
  id: string;
  itemId: number;
  userId: number;   //creator id
  creatorInfo: User | null;
  ownerIds: number[];  
  paymentRatios: { [key: number]: number };
  comment: string;
  createdAt: Date;
  status: 'Pending' | 'Accepted' | 'Rejected'  | 'Withdrawn' | 'Finalised';
  counterProposalToId?: string;
  usersResponses: { userId: number; accept: boolean }[];
}
