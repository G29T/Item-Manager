import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UsersState } from './user.reducer';

export const selectUserState = createFeatureSelector<UsersState>('user');

export const selectCurrentUserId = createSelector(
  selectUserState,
  (state: UsersState) => state.currentUserId
);

export const selectUsers = createSelector(
  selectUserState,
  (state: UsersState) => state.users
);

export const selectSelectedUser = createSelector(
  selectUserState,
  (state: UsersState) => state.selectedUser
);
