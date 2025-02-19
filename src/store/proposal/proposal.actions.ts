import { createAction, props } from '@ngrx/store';
import { Proposal } from '../../app/models/proposal.model';

export const loadProposals = createAction('[Proposal] Load Proposals');

export const loadProposalsSuccess = createAction(
  '[Proposal] Load Proposals Success',
  props<{ proposals: { [userId: number]: Proposal[] } }>()
);

export const loadProposalsFailure = createAction(
  '[Proposal] Load Proposals Failure',
  props<{ error: string }>()
);

export const createProposal = createAction(
  '[Proposal] Create Proposal',
  props<{ proposal: Proposal }>()
);

export const counterProposal = createAction(
  '[Proposal] Counterproposal',
  props<{ proposalId: string; newProposal: Proposal }>()
);

export const acceptProposal = createAction(
  '[Proposal] Accept Proposal',
  props<{ proposalId: string; userId: number }>()
);

export const rejectProposal = createAction(
  '[Proposal] Reject Proposal',
  props<{ proposalId: string }>() 
);

export const withdrawProposal = createAction(
  '[Proposal] Withdraw Proposal',
  props<{ proposalId: string }>() 
);

export const setBackToPendingProposal = createAction(
  '[Proposal] Pending Proposal',
  props<{ proposalId: string }>() 
);
