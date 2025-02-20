import { createSelector, createFeatureSelector } from '@ngrx/store';
import { OwnerState } from './owner.reducer';

export const selectOwnerState = createFeatureSelector<OwnerState>('owners');

export const selectOwners = createSelector(
    selectOwnerState,
    (state: OwnerState) => state.owners
);

export const selectOwnerNameById = (ownerId: number) => createSelector(
    selectOwnerState,
    (state: OwnerState) => {
      const owner = state.owners.find(owner => owner.id === ownerId);
      return owner ? owner.name : 'Unknown Owner';
    }
);