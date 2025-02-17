import { createAction, props } from '@ngrx/store';
import { Proposal } from '../../app/models/proposal.model';

export const loadProposals = createAction('[Proposal] Load Proposals');

export const loadProposalsSuccess = createAction(
  '[Proposal] Load Proposals Success',
  props<{ proposals: Proposal[] }>()
);

export const createProposal = createAction(
  '[Proposal] Create Proposal',
  props<{ proposal: Proposal }>()
);

export const createProposalSuccess = createAction(
  '[Proposal] Create Proposal Success',
  props<{ proposal: Proposal }>()
);

export const counterProposal = createAction(
  '[Proposal] Counter Proposal',
  props<{ proposalId: string; newProposal: Proposal }>()
);

export const acceptProposal = createAction(
  '[Proposal] Accept Proposal',
  props<{ proposalId: string }>()
);

export const rejectProposal = createAction(
  '[Proposal] Reject Proposal',
  props<{ proposalId: string; counterProposal: Proposal }>()
);
