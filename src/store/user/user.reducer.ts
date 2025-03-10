import { createReducer, on } from '@ngrx/store';
import { setCurrentUser, loadUsersSuccess, selectUser } from './user.actions';
import { User } from '../../app/models/user.model';

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
    on(selectUser, (state, { user }) => ({ ...state, selectedUser: user }))
  );