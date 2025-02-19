import { createReducer, on } from '@ngrx/store';
import * as ProposalActions from './proposal.actions';
import { Proposal } from '../../app/models/proposal.model';

export interface ProposalState {
  proposals: { [userId: number]: Proposal[] }; 
  creationSuccess: boolean;
  creationError: string | null; 
}

const initialState: ProposalState = {
  proposals: {},
  creationSuccess: false,
  creationError: null,
};

export const proposalReducer = createReducer(
  initialState,

  // since accessing localStorage is generally a synchronous operation
  // so the logic can also stay in this reducer rather than effects
  // on(ProposalActions.loadProposals, (state) => {
  //   try {
  //     const storedProposals = localStorage.getItem('proposalsFromLocalStorage');
  //     const parsedProposals = storedProposals ? JSON.parse(storedProposals) : {};
  
  //     return {
  //       ...state,
  //       proposals: parsedProposals,
  //     };
  //   } catch (error) {
  //     console.error("Error loading proposals from local storage:", error);
  //     return state;
  //   }
  // }),  

  on(ProposalActions.loadProposalsSuccess, (state, { proposals }) => ({
    ...state,
    proposals,
  })),
  
  on(ProposalActions.loadProposalsFailure, (state, { error }) => ({
    ...state,
    creationError: error,
  })),  

  on(ProposalActions.createProposal, (state, { proposal }) => {
    const userProposals = state.proposals[proposal.userId] || [];

    const hasPendingProposal = userProposals.some(existingProposal => 
      existingProposal.itemId === proposal.itemId && existingProposal.status === 'Pending'
    );

    if (hasPendingProposal) {
      console.error("There is a pending proposal that waits to be finalized.");
      return {
        ...state,
        creationSuccess: false,
        creationError: "There is a pending proposal that waits to be finalized.",
      };
    }

    try {
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

      localStorage.setItem('proposalsFromLocalStorage', JSON.stringify(updatedProposals));

      return {
        ...state,
        proposals: updatedProposals, 
        creationSuccess: true, 
        creationError: null, 
      };
    } catch (error) {
      console.error("An error occurred while creating the proposal:", error);
      return {
        ...state,
        creationSuccess: false,
        creationError: "Error occurred while creating proposal.", 
      };
    }
  }),

  on(ProposalActions.counterProposal, (state, { proposalId, newProposal }) => {
    const updatedProposals = JSON.parse(JSON.stringify(state.proposals));

    try{
      for (const key in updatedProposals) {
        updatedProposals[key] = updatedProposals[key].map((proposal: Proposal) => {
          if (proposal.id === proposalId) {
            return { ...proposal, status: 'Rejected' as const };
          }
          return proposal;
        });

        updatedProposals[key].push(newProposal);
      }

      localStorage.setItem('proposalsFromLocalStorage', JSON.stringify(updatedProposals));

      return {
        ...state,
        proposals: updatedProposals,
        creationSuccess: true, 
          creationError: null,
      };
    } catch (error) {
        console.error("An error occurred while creating the counterproposal:", error);
        return {
          ...state,
          creationSuccess: false,
          creationError: "Error occurred while creating counterproposal.", 
        };
      }
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
            response.userId === userId ? { ...response, accept: true } : response
          )
        };
      });
    }

    const allAccepted = updatedProposals[userId]?.some((proposal: Proposal) =>
      proposal.usersResponses.every(response => response.accept)
    );

    if (allAccepted) {
      for (const key in updatedProposals) {
        updatedProposals[key] = updatedProposals[key].map((proposal: Proposal) => {
          if (proposal.id === proposalId) {
            return {
              ...proposal,
              status: "Finalised - Accepted" 
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

    localStorage.setItem('proposalsFromLocalStorage', JSON.stringify(updatedProposals));

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

    localStorage.setItem('proposalsFromLocalStorage', JSON.stringify(updatedProposals));

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

    localStorage.setItem('proposalsFromLocalStorage', JSON.stringify(updatedProposals));

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

    localStorage.setItem('proposalsFromLocalStorage', JSON.stringify(updatedProposals));

    return {
      ...state,
      proposals: updatedProposals,
    };
  }),
);
