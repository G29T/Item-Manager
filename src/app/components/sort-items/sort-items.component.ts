import { Component, Output, EventEmitter } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'sort-items',
  templateUrl: './sort-items.component.html',
  styleUrls: ['./sort-items.component.scss'],
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule],
})
export class SortItemsComponent {
  @Output() sortChange = new EventEmitter<string>();

  onSortChange(value: string) {
    this.sortChange.emit(value as 'nameAsc' | 'nameDsc' | 'costAsc' | 'costDsc' | 'pendingStatus');
  }
}
