import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Item } from '../../models/items.model';
import { firstValueFrom, Observable, take } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProposalDialogComponent } from '../proposal-dialog/proposal-dialog.component';
import { Store } from '@ngrx/store';
import { selectSelectedItem } from '../../../store/item/item.selectors';
import { selectItem } from '../../../store/item/item.actions';
import { User } from '../../models/user.model';
import { selectSelectedUser } from '../../../store/user/user.selectors';

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
  currentUser$: Observable<User | null>
  selectedItem$: Observable<Item | null>;
  sortingCriterion: 'nameAsc' | 'nameDsc' | 'costAsc' | 'costDsc' | 'pendingStatus' = 'nameAsc';
  selectedItemId: number | null = null;
  isUserSelected: boolean = false;

  constructor(private store: Store, private dialog: MatDialog) {
    this.currentUser$ = this.store.select(selectSelectedUser);
    this.selectedItem$ = this.store.select(selectSelectedItem);
    this.selectedItem$.subscribe(item => {
      this.selectedItemId = item ? item.id : null; 
    });
  }
  
  async checkIfUserWasSelected() {
    const currentUser = await firstValueFrom(this.currentUser$);
    this.isUserSelected = currentUser !== null;
  }
  
  onSelectItem(item: Item): void {
    this.store.dispatch(selectItem({ item }));
  }

  openProposalDialog(item: Item): void {
    const previouslyFocusedElement = document.activeElement as HTMLElement;

    const dialogRef = this.dialog.open(ProposalDialogComponent, {
        minWidth: '400px',
        data: {
            dialogTitle: 'Proposal',
            item: item,
        },
    });

    // When a modal is opened aria-hidden="true" is added to the app-root element 
    // to make the background content inaccessible to assistive technologies 
    // When the modal is closed previouslyFocusedElement.focus() is restoring focus to the previously focused element
    dialogRef.afterClosed().subscribe(() => {
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    });
  }
}
