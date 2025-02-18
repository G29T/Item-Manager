import { createSelector, createFeatureSelector } from '@ngrx/store';
import { OwnerState } from './owner.reducer';

export const selectOwnerState = createFeatureSelector<OwnerState>('owners');

export const selectOwners = createSelector(
    selectOwnerState,
    (state: OwnerState) => state.owners
);

