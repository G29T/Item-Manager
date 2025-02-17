import { createReducer, on } from '@ngrx/store';
import * as ProposalActions from './proposal.actions';
import { Proposal } from '../../app/models/proposal.model';

export interface ProposalState {
  proposals: Proposal[];
}

const initialState: ProposalState = {
  proposals: [],
};

export const proposalReducer = createReducer(
  initialState,
  on(ProposalActions.createProposal, (state, { proposal }) => ({
    ...state,
    proposals: [...state.proposals, proposal] 
  })),
  on(ProposalActions.loadProposalsSuccess, (state, { proposals }) => ({
    ...state,
    proposals,
  })),
  on(ProposalActions.createProposalSuccess, (state, { proposal }) => ({
    ...state,
    proposals: [...state.proposals, proposal],
  })),
  on(ProposalActions.counterProposal, (state, { proposalId, newProposal }) => ({
    ...state,
    proposals: state.proposals.map((proposal) =>
      proposal.id === proposalId ? { ...proposal, ...newProposal } : proposal
    ),
  })),
  on(ProposalActions.acceptProposal, (state, { proposalId }) => ({
    ...state,
    proposals: state.proposals.map((proposal) =>
      proposal.id === proposalId ? { ...proposal, status: 'Accepted' as const } : proposal
    ),
  })),
  on(ProposalActions.rejectProposal, (state, { proposalId, counterProposal }) => ({
    ...state,
    proposals: state.proposals.map((proposal) =>
      proposal.id === proposalId
        ? { ...proposal, status: 'Rejected' as const, counterProposal }
        : proposal
    ),
  }))
);
