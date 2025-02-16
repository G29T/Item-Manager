import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemsState } from './item.reducer';

export const selectItemState = createFeatureSelector<ItemsState>('items');
export const selectAllItems = createSelector(selectItemState, (state) => state.items);
export const selectSelectedItem = createSelector(selectItemState, (state) => state.selectedItem);
export const selectUserItems = (userId: number) =>
    createSelector(selectAllItems, (items) => items.filter(item => item.ownerIds.includes(userId)));
// export const selectSharedItems = createSelector(selectAllItems, (items) => items.filter((item) => item.shared));