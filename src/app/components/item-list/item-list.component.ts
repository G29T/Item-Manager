import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../../models/items.model';
import { Observable } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, CommonModule } from '@angular/common';


@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  imports: [MatListModule, CommonModule, AsyncPipe],
})
export class ItemListComponent {
  @Input() items: Item[] = []; 
  @Input() hasPendingProposals!: (itemId: number) => Observable<boolean>;
  @Output() itemSelected = new EventEmitter<Item>();

  onSelectItem(item: Item) {
    this.itemSelected.emit(item);
  }

}
