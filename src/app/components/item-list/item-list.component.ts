import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, switchMap } from 'rxjs';
import { Item } from '../../models/items.model';
import { loadItems, selectItem } from '../../../store/item/item.actions';
import { selectAllItems, selectSelectedItem, selectUserItems } from '../../../store/item/item.selectors';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { ProposalFormComponent } from '../proposal-form/proposal-form.component';
import { DataService } from '../../services/data.services';
import { ItemsState } from '../../../store/item/item.reducer';
import { selectCurrentUserId } from '../../../store/user/user.selectors';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  imports: [ProposalFormComponent, MatListModule, CommonModule, AsyncPipe],
})
export class ItemListComponent implements OnInit {
  allItems$: Observable<Item[]>;
  userItems$: Observable<Item[]>;
  selectedItem$: Observable<Item | null>;

  constructor(private dataService: DataService, private store: Store<ItemsState>) {
    this.allItems$ = this.store.select(selectAllItems);
    this.selectedItem$ = this.store.select(selectSelectedItem);


    this.userItems$ = this.store.select(selectCurrentUserId).pipe(
      switchMap(userId => {
        if (userId !== null) {
          return this.store.select(selectUserItems(userId));
        } else {
          return of([]);
        }
      })
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadItems());

    // this.allItems$.subscribe(items => {
    //   console.log('Selected All Items:', items);
    // });

  }
  
  onSelectItem(item: Item): void {
    this.store.dispatch(selectItem({ item }));
  }
}
