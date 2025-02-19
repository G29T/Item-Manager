import { Component, Output, EventEmitter } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'sort-selector',
  templateUrl: './sort-selector.component.html',
  styleUrls: ['./sort-selector.component.scss'],
  imports: [MatFormField, MatLabel, MatOptionModule, MatSelectModule],
})
export class SortSelectorComponent {
  @Output() sortChange = new EventEmitter<string>();

  onSortChange(value: string) {
    this.sortChange.emit(value as 'nameAsc' | 'nameDsc' | 'costAsc' | 'costDsc' | 'pendingStatus');
  }
}
