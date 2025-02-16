import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemsState } from './item.reducer';
import { selectCurrentUserId, selectUsers } from '../user/user.selectors';

export const selectItemState = createFeatureSelector<ItemsState>('items');
export const selectAllItems = createSelector(selectItemState, (state) => state.items);
export const selectSelectedItem = createSelector(selectItemState, (state) => state.selectedItem);
export const selectItemsByUser = createSelector(
    selectAllItems,
    selectCurrentUserId,
    selectUsers,
    (items, currentUserId, users) => {
        if (!currentUserId || !users?.length) return [];
      
        const partyId = users.find(user => user.id === currentUserId)?.partyId;
        return partyId ? items.filter(item => item.ownerIds.includes(partyId)) : [];
    }
  );
  
// export const selectSharedItems = createSelector(selectAllItems, (items) => items.filter((item) => item.shared));