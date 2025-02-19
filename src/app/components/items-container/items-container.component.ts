import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, combineLatest, forkJoin, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { Item } from '../../models/items.model';
import { selectItem } from '../../../store/item/item.actions';
import { selectItemsByUser, selectSelectedItem } from '../../../store/item/item.selectors';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { ItemsState } from '../../../store/item/item.reducer';
import { ProposalFormComponent } from '../proposal-form/proposal-form.component';
import { ProposalHistoryComponent } from '../proposal-history/proposal-history.component';
import { selectProposalsForItem } from '../../../store/proposal/proposal.selector';
import { selectCurrentUserId, selectUsers } from '../../../store/user/user.selectors';
import { User } from '../../models/user.model';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SortSelectorComponent } from '../sort-selector/sort-selector.component';
import { ItemListComponent } from '../item-list/item-list.component';
import { ItemUtilsService } from '../../services/item-utils.service';

@Component({
  selector: 'items-container',
  templateUrl: './items-container.component.html',
  styleUrls: ['./items-container.component.scss'],
  imports: [SortSelectorComponent, ItemListComponent, ProposalFormComponent, ProposalHistoryComponent, CommonModule, AsyncPipe],
})
export class ItemsContainer {
    userItems$: Observable<Item[]>;
    selectedItem$: Observable<Item | null>;
    currentUserId$: Observable<number | null>;
    users$: Observable<User[]>;
    sortingCriterion: 'nameAsc' | 'nameDsc' | 'costAsc' | 'costDsc' | 'pendingStatus' = 'nameAsc';

    constructor(private store: Store<ItemsState>, private itemUtils: ItemUtilsService) {
        this.currentUserId$ = this.store.select(selectCurrentUserId);
        this.userItems$ = this.store.select(selectItemsByUser).pipe(
            map(items => items || []),
            map(items => this.itemUtils.sortByCriterion(items, 'nameAsc'))
        );
        this.selectedItem$ = this.store.select(selectSelectedItem);
        this.users$ = this.store.select(selectUsers); 
    }
  
    onSelectItem(item: Item): void {
        this.store.dispatch(selectItem({ item }));
    }
  
//   setSortingCriterion(criterion: string) {
//     if (['nameAsc', 'nameDsc', 'costAsc', 'costDsc', 'pendingStatus'].includes(criterion)) {
//       this.sortingCriterion = criterion as 'nameAsc' | 'nameDsc' | 'costAsc' | 'costDsc' | 'pendingStatus';
//       this.sortItems(); 
//     }
//   }

    setSortingCriterion(criterion: string) {
        this.sortingCriterion = criterion as 'nameAsc' | 'nameDsc' | 'costAsc' | 'costDsc' | 'pendingStatus';;
        this.sortItems(); 
    }

    sortItems() {
        this.userItems$ = this.userItems$.pipe(
        switchMap((items) => {
            if (items.length === 0) {
            return of([]); 
            }
    
            const proposalChecks$ = items.map(item => {
            return this.itemUtils.hasPendingProposals(item.id).pipe(
                map(hasPending => ({ ...item, hasPending }))
            );
            });
    
            return combineLatest(proposalChecks$)
        }),
        map((itemsWithStatus) => {
            return this.itemUtils.sortByCriterion(itemsWithStatus, this.sortingCriterion);
        })
        );
    }

    hasPendingProposals(itemId: number): Observable<boolean> {
        return this.itemUtils.hasPendingProposals(itemId);
    }
}
