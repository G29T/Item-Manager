import { createReducer, on } from '@ngrx/store';
import { loadOwnersFailure, loadOwnersSuccess } from './owner.actions';
import { Owner } from '../../app/models/owner.model';

export interface OwnerState {
  owners: Owner[];
}

export const initialOwnerState: OwnerState = {
  owners: []
};

export const ownerReducer = createReducer(
  initialOwnerState,
  on(loadOwnersSuccess, (state, { owners }) => ({
    ...state,
    owners,
  })),
  on(loadOwnersFailure, (state, { error }) => ({
    ...state,
    loading: false, 
    error, 
  }))
);

