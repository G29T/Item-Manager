import { createAction, props } from '@ngrx/store';
import { User } from '../../app/models/user.model';

export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: User[] }>());
export const loadUsersFailure = createAction('[User] Load Users Failure', props<{ error: any }>());
export const selectUser = createAction(
    '[User] Select User',
    props<{ user: User }>() // Action payload to carry the selected user
  );
export const setCurrentUser = createAction('[User] Set Current User', props<{ userId: number }>());

export const clearCurrentUser = createAction('[User] Clear Current User');
