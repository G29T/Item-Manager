import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, combineLatest, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
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

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  imports: [ProposalFormComponent, ProposalHistoryComponent, MatListModule, CommonModule, AsyncPipe, MatFormField, MatLabel, MatOptionModule, MatSelectModule],
})

export class ItemListComponent {
  userItems$: Observable<Item[]>;
  selectedItem$: Observable<Item | null>;
  currentUserId$: Observable<number | null>;
  users$: Observable<User[]>;
  sortingCriterion: 'nameAsc' | 'costAsc' | 'pendingStatus' = 'nameAsc';

  constructor(private store: Store<ItemsState>) {
    this.currentUserId$ = this.store.select(selectCurrentUserId);
    this.userItems$ = this.store.select(selectItemsByUser);
    this.selectedItem$ = this.store.select(selectSelectedItem);
    this.users$ = this.store.select(selectUsers); 
  }

  hasPendingProposals(itemId: number): Observable<boolean> {
    return this.store.select(selectProposalsForItem(itemId)).pipe(
      switchMap((proposals) => {
        if (!proposals) return of(false);
        
        return this.currentUserId$.pipe(
          map((currentUserId) => {
            if (currentUserId === null) return false; 

            const userProposals = proposals[currentUserId] || [];
            return userProposals.some(proposal => proposal.status === 'Pending');
          })
        );
      })
    );
  }
  
  onSelectItem(item: Item): void {
    this.store.dispatch(selectItem({ item }));
  }
  
  setSortingCriterion(criterion: 'nameAsc' | 'costAsc' | 'pendingStatus') {
    this.sortingCriterion = criterion;
    this.sortItems(); 
  }

  sortItems() {
    this.userItems$ = this.userItems$.pipe(
      switchMap((items) => {
        if (items.length === 0) {
          return of([]); 
        }
  
        const proposalChecks$ = items.map(item => {
          return this.hasPendingProposals(item.id).pipe(
            map(hasPending => ({ ...item, hasPending }))
          );
        });
  
        return combineLatest(proposalChecks$)
      }),
      map((itemsWithStatus) => {
        return this.sortByCriterion(itemsWithStatus, this.sortingCriterion);
      })
    );
  }

  private sortByCriterion(items: Item[], criterion: 'nameAsc' | 'costAsc' | 'pendingStatus'): Item[] {
    switch (criterion) {
      case 'nameAsc':
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case 'costAsc':
        return items.sort((a, b) => a.totalCost - b.totalCost);
      case 'pendingStatus':
        return items.sort((a, b) => {
          return (b.hasPending ? 1 : 0) - (a.hasPending ? 1 : 0);
        });
      default:
        return items;
    }
  }

}
