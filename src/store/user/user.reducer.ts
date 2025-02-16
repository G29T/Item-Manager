import { createReducer, on } from '@ngrx/store';
import { setCurrentUser, clearCurrentUser, loadUsersSuccess } from './user.actions';
import { User } from '../../app/models/user.model';

// export interface CurrentUserState {
//   currentUserId: number | null;
// }

// export const initialCurrentUserState: CurrentUserState = {
//   currentUserId: null,
// };

// export const userReducer = createReducer(
//   initialState,
//   on(loadUsersSuccess, (state, { users }) => ({ ...state, users })),
//   on(setCurrentUser, (state, { userId }) => ({ ...state, currentUserId: userId })),
//   on(clearCurrentUser, state => ({ ...state, currentUserId: null }))
// );

export interface UsersState {
    users: User[];
    selectedUser: User | null;
    currentUserId: number | null; 
  }
  
  export const initialState: UsersState = {
    users: [],
    selectedUser: null,
    currentUserId: null, 
  };
  
  export const userReducer = createReducer(
    initialState,
    on(loadUsersSuccess, (state, { users }) => ({ ...state, users })),
    on(setCurrentUser, (state, { userId }) => ({ ...state, currentUserId: userId })),
    on(clearCurrentUser, state => ({ ...state, currentUserId: null }))
  );