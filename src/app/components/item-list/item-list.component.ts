import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, switchMap } from 'rxjs';
import { Item } from '../../models/items.model';
import { selectItem } from '../../../store/item/item.actions';
import { selectItemsByUser, selectSelectedItem } from '../../../store/item/item.selectors';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { DataService } from '../../services/data.services';
import { ItemsState } from '../../../store/item/item.reducer';
import { ProposalFormComponent } from '../proposal-form/proposal-form.component';
import { Proposal } from '../../models/proposal.model';
import { selectProposalsForItem } from '../../../store/proposal/proposal.selector';
import { ProposalHistoryComponent } from '../proposal-history/proposal-history.component';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  imports: [ProposalFormComponent, ProposalHistoryComponent, MatListModule, CommonModule, AsyncPipe],
})

export class ItemListComponent {
  // allItems$: Observable<Item[]>;
  userItems$: Observable<Item[]>;
  selectedItem$: Observable<Item | null>;
  proposals$: Observable<Proposal[]>;

  constructor(private dataService: DataService, private store: Store<ItemsState>) {
    // this.allItems$ = this.store.select(selectAllItems);
    this.userItems$ = this.store.select(selectItemsByUser);
    this.selectedItem$ = this.store.select(selectSelectedItem);
    this.proposals$ = this.selectedItem$.pipe(
      switchMap(selectedItem => {
        return selectedItem ? this.store.select(selectProposalsForItem(selectedItem.id)) : of([]);
      })
    );
  }

  // ngOnInit(): void {
  //   this.store.dispatch(loadItemsByUser());

  //   this.userItems$.subscribe(items => {
  //     console.log('Selected All Items:', items);
  //   });

  // }
  
  onSelectItem(item: Item): void {
    this.store.dispatch(selectItem({ item }));
  }
}
