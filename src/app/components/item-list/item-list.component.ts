import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Item } from '../../models/items.model';
import { Observable } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProposalDialogComponent } from '../proposal-dialog/proposal-dialog.component';
import { Store } from '@ngrx/store';
import { selectSelectedItem } from '../../../store/item/item.selectors';
import { selectItem } from '../../../store/item/item.actions';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  imports: [MatListModule, CommonModule, AsyncPipe, MatIconModule, MatIconButton],
  encapsulation: ViewEncapsulation.None, 
})
export class ItemListComponent {
  @Input() items: Item[] = []; 
  @Input() hasPendingProposals!: (itemId: number) => Observable<boolean>;

  selectedItem$: Observable<Item | null>;
  sortingCriterion: 'nameAsc' | 'nameDsc' | 'costAsc' | 'costDsc' | 'pendingStatus' = 'nameAsc';
  selectedItemId: number | null = null;

  constructor(private store: Store, private dialog: MatDialog) {
    this.selectedItem$ = this.store.select(selectSelectedItem);
    this.selectedItem$.subscribe(item => {
      this.selectedItemId = item ? item.id : null; 
    });
  }
  
  onSelectItem(item: Item): void {
    this.store.dispatch(selectItem({ item }));
  }

  openProposalDialog(item: Item): void {
    const dialogRef = this.dialog.open(ProposalDialogComponent, {
        width: '400px',
        data: {
            dialogTitle: 'Proposal',
            item: item,
        },
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            console.log('Proposal submitted:', result);
        }
    });
  }
}
