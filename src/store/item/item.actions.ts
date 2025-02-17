import { createAction, props } from '@ngrx/store';
import { Item } from '../../app/models/items.model';

export const loadItems = createAction('[Item] Load Items');
export const loadItemsSuccess = createAction('[Item] Load Items Success', props<{ items: Item[] }>());
export const loadItemsFailure = createAction('[Item] Load Items Failure', props<{ error: any }>());

export const loadItemsByUser = createAction('[Item] Load Items By User');
export const loadItemsByUserSuccess = createAction('[Item] Load Items By User Success', props<{ items: Item[] }>());
export const loadItemsByUserFailure = createAction('[Item] Load Items By User Failure', props<{ error: any }>());
// export const filterItemsByUser = createAction('[Item] Filter Items By User', props<{ userId: number }>());
export const selectItem = createAction('[Item] Select Item', props<{ item: Item | null }>()); 
export const updateItem = createAction('[Item] Update Item', props<{ item: Item }>());