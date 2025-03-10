import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { Item } from '../../models/items.model';
import { selectItemsByUser, selectSelectedItem } from '../../../store/item/item.selectors';
import { AsyncPipe, CommonModule } from '@angular/common';
import { selectCurrentUserId, selectUsers } from '../../../store/user/user.selectors';
import { User } from '../../models/user.model';
import { SortItemsComponent } from '../sort-items/sort-items.component';
import { ItemListComponent } from '../item-list/item-list.component';
import { ItemUtilsService } from '../../services/item-utils.service';

@Component({
  selector: 'items-container',
  templateUrl: './items-container.component.html',
  styleUrls: ['./items-container.component.scss'],
  imports: [SortItemsComponent, ItemListComponent, CommonModule, AsyncPipe],
})
export class ItemsContainerComponent {
    userItems$: Observable<Item[]>;
    selectedItem$: Observable<Item | null>;
    currentUserId$: Observable<number | null>;
    users$: Observable<User[]>;
    sortingCriterion: 'nameAsc' | 'nameDsc' | 'costAsc' | 'costDsc' | 'pendingStatus' = 'nameAsc';
    @Output() itemClicked = new EventEmitter<void>();

    constructor(private store: Store, private itemUtils: ItemUtilsService) {
        this.currentUserId$ = this.store.select(selectCurrentUserId);
        this.userItems$ = this.store.select(selectItemsByUser).pipe(
            map(items => items || []),
            map(items => this.itemUtils.sortByCriterion(items, 'nameAsc'))
        );
        this.selectedItem$ = this.store.select(selectSelectedItem);
        this.users$ = this.store.select(selectUsers); 
    }
  
    onItemClick() {
        this.itemClicked.emit();
    }

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
