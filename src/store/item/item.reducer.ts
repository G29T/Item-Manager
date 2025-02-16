import { createReducer, on } from '@ngrx/store';
import { Item } from '../../app/models/items.model';
import { loadItemsByUserSuccess, loadItemsSuccess, selectItem, updateItem } from './item.actions';

export interface ItemsState {
  items: Item[];
  selectedItem: Item | null;
}

export const initialState: ItemsState = {
  items: [],
  selectedItem: null,
};

export const itemReducer = createReducer(
  initialState,
  on(loadItemsSuccess, (state, { items }) => ({ ...state, items })),
  on(loadItemsByUserSuccess, (state, { items }) => ({
    ...state,
    items
  })),
  on(selectItem, (state, { item }) => ({ ...state, selectedItem: item })),
//   on(filterItemsByUser, (state, { userId }) => ({
//     ...state,
//     items: state.items.filter(item => item.ownerIds.includes(userId)),
//     // items: state.items.filter((item) => item.ownerIds === userId),
//   })),
// TO DO:   changes to updateItem
  on(updateItem, (state, { item }) => ({
    ...state,
    items: state.items.map((i) => (i.id === item.id ? item : i)),
  }))
);
