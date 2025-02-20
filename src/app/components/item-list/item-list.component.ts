import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Item } from '../../models/items.model';
import { Observable } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Proposal } from '../../models/proposal.model';
import { ProposalDialogComponent } from '../proposal-dialog/proposal-dialog.component';

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
  @Output() itemSelected = new EventEmitter<Item>();

  selectedItemId: number | null = null; 

  constructor(private dialog: MatDialog) {}

  onSelectItem(item: Item) {
    this.selectedItemId = item.id; 
    this.itemSelected.emit(item);
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
