import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Item } from '../../models/items.model';
import { selectItem } from '../../../store/item/item.actions';
import { selectItemsByUser, selectSelectedItem } from '../../../store/item/item.selectors';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { ItemsState } from '../../../store/item/item.reducer';
import { ProposalFormComponent } from '../proposal-form/proposal-form.component';
import { ProposalHistoryComponent } from '../proposal-history/proposal-history.component';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  imports: [ProposalFormComponent, ProposalHistoryComponent, MatListModule, CommonModule, AsyncPipe],
})

export class ItemListComponent {
  userItems$: Observable<Item[]>;
  selectedItem$: Observable<Item | null>;

  constructor(private store: Store<ItemsState>) {
    this.userItems$ = this.store.select(selectItemsByUser);
    this.selectedItem$ = this.store.select(selectSelectedItem);
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
