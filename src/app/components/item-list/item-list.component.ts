import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Item } from '../../models/items.model';
import { Observable } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

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

  onSelectItem(item: Item) {
    this.selectedItemId = item.id; 
    this.itemSelected.emit(item);
  }
}
