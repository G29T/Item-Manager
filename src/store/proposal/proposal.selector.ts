import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ProposalState } from './proposal.reducer';

export const selectProposalState = createFeatureSelector<ProposalState>('proposals');

export const selectAllProposals = createSelector(
  selectProposalState,
  (state) => state.proposals
);

export const selectProposalsForItem = (itemId: number) =>
  createSelector(selectAllProposals, (proposals) =>
    proposals.filter((proposal) => proposal.itemId === itemId)
  );

