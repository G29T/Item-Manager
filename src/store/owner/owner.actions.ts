import { createAction, props } from '@ngrx/store';
import { Owner } from '../../app/models/owner.model';

export const loadOwners = createAction('[Owner] Load Owners');
export const loadOwnersSuccess = createAction('[Owner] Load Owners Success', props<{ owners: Owner[] }>());
export const loadOwnersFailure = createAction('[Owner] Load Owners Failure', props<{ error: any }>());
