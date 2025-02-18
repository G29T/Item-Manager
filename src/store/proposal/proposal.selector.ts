import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ProposalState } from './proposal.reducer';
import { Proposal } from '../../app/models/proposal.model';

export const selectProposalState = createFeatureSelector<ProposalState>('proposals');

export const selectAllProposals = createSelector(
  selectProposalState,
  (state: ProposalState) => state.proposals
);

export const selectProposalsForItem = (itemId: number) =>
  createSelector(selectAllProposals, (proposals) => {
    const result: { userId: number; proposal: Proposal }[] = []; 

    for (const userId in proposals) {
      if (proposals.hasOwnProperty(userId)) {
        const userProposals = proposals[userId];
        const filteredProposals = userProposals.filter(proposal => proposal.itemId === itemId);

        filteredProposals.forEach(proposal => {
          result.push({ userId: Number(userId), proposal }); 
        });
      }
    }

    const formattedResult = result.reduce((acc, { userId, proposal }) => {
      if (!acc[userId]) {
        acc[userId] = []; 
      }
      acc[userId].push(proposal); 
      return acc;
    }, {} as Record<number, Proposal[]>);

    return formattedResult; 
  });

