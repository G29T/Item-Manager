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

export const selectCurrentUserPartyId = createSelector(
  selectUsers,
  selectCurrentUserId,
  (users, currentUserId) => {
    const currentUser = users.find(user => user.id === currentUserId);
    return currentUser ? currentUser.partyId : 0;  //0 because the current partyIds start from 1
  }
);
