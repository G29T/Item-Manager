export interface Proposal {
  id: string;
  itemId: number;
  userId: number;  
  ownerIds: number[];  
  paymentRatios: { [key: number]: number };
  comment: string;
  createdAt: Date;
  status: 'Pending' | 'Accepted' | 'Rejected'  | 'Withdrawn' | 'Finalized - Accepted';
  counterProposalToId?: string;
  usersResponses: { userId: number; accept: boolean }[];
}
