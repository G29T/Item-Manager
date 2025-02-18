import { createReducer, on } from '@ngrx/store';
import * as ProposalActions from './proposal.actions';
import { Proposal } from '../../app/models/proposal.model';

export interface ProposalState {
  proposals: { [userId: number]: Proposal[] }; 
}

const initialState: ProposalState = {
  proposals: {},
};

export const proposalReducer = createReducer(
  initialState,

  on(ProposalActions.createProposal, (state, { proposal }) => {

    const userProposals = state.proposals[proposal.userId] || [];

    const hasPendingProposal = userProposals.some(existingProposal => 
      existingProposal.itemId === proposal.itemId && existingProposal.status === 'Pending'
    );

    if (hasPendingProposal) {
      console.error("There is a pending proposal that waits to be finalized.");
      return state; 
    }

    const updatedProposals = {
      ...state.proposals,
      [proposal.userId]: [
        ...(state.proposals[proposal.userId] || []),
        proposal,
      ],
    };

    proposal.usersResponses.forEach(({ userId }) => {
    
      if (!updatedProposals[userId]) {
        updatedProposals[userId] = []; 
      }
  
      updatedProposals[userId] = [
        ...updatedProposals[userId], 
        proposal, 
      ];
    });
  
    return {
      ...state,
      proposals: updatedProposals, 
    };
  }),
  
  on(ProposalActions.counterProposal, (state, { proposalId, newProposal }) => {

    const updatedProposals = JSON.parse(JSON.stringify(state.proposals));

    for (const key in updatedProposals) {
      updatedProposals[key] = updatedProposals[key].map((proposal: Proposal) => {
        if (proposal.id === proposalId) {
          return { ...proposal, status: 'Rejected' as const };
        }
        return proposal;
      });

      updatedProposals[key].push(newProposal);
    }

    return {
      ...state,
      proposals: updatedProposals,
    };
  }),

  on(ProposalActions.acceptProposal, (state, { proposalId, userId }) => {
    const userProposals = state.proposals[userId] || [];

    const updatedProposals = JSON.parse(JSON.stringify(state.proposals)); 
  
    for (const key in updatedProposals) {
      updatedProposals[key] = updatedProposals[key].map((proposal: Proposal) => {
        if (proposal.id !== proposalId) return proposal; 
  
        return {
          ...proposal,
          usersResponses: proposal.usersResponses.map(response =>
            response.userId === userId  ? { ...response, accept: true } : response
          )
        };
      });
    }
  
    const allAccepted = updatedProposals[userId]?.some((proposal: Proposal) =>
      proposal.usersResponses.every(response => response.accept)
    );

    // const status = allAccepted ? "Finalized - Accepted" : "Accepted";
  
    if (allAccepted) {
      for (const key in updatedProposals) {
        updatedProposals[key] = updatedProposals[key].map((proposal: Proposal) => {
          if (proposal.id === proposalId) {
            return {
              ...proposal,
              status: "Finalized - Accepted" 
            };
          }
          return proposal;
        });
      }
    } else {
      updatedProposals[userId] = userProposals.map(proposal => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            status: "Accepted", 
            usersResponses: proposal.usersResponses.map(response =>
              response.userId === userId ? { ...response, accept: true } : response
            )
          };
        }
        return proposal;
      });
    }
  
    return {
      ...state,
      proposals: updatedProposals,
    };
  }),
  
  on(ProposalActions.rejectProposal, (state, { proposalId }) => {
    const updatedProposals = { ...state.proposals };
  
    Object.keys(updatedProposals).forEach((userIdStr) => {
      const userId = Number(userIdStr); 
  
      updatedProposals[userId] = updatedProposals[userId].map((proposal) =>
        proposal.id === proposalId ? { ...proposal, status: 'Rejected' as const } : proposal
      );
    });
  
    return {
      ...state,
      proposals: updatedProposals,
    };
  }),
  
  // Object.keys
  on(ProposalActions.withdrawProposal, (state, { proposalId }) => {
    const updatedProposals = JSON.parse(JSON.stringify(state.proposals));

    for (const key in updatedProposals) {
      updatedProposals[key] = updatedProposals[key].map((proposal: Proposal) => {
        if (proposal.id === proposalId) {
          return { ...proposal, status: 'Withdrawn' as const };
        }
        return proposal;
      });
    }
  
    return {
      ...state,
      proposals: updatedProposals,
    };
  }),

  on(ProposalActions.setBackToPendingProposal, (state, { proposalId }) => {
    const updatedProposals = JSON.parse(JSON.stringify(state.proposals));

    for (const key in updatedProposals) {
      updatedProposals[key] = updatedProposals[key].map((proposal: Proposal) => {
        if (proposal.id === proposalId) {
          return { ...proposal, status: 'Pending' as const };
        }
        return proposal;
      });
    }
  
    return {
      ...state,
      proposals: updatedProposals,
    };
  }),
);
