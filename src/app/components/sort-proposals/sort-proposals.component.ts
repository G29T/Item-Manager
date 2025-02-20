import { Component, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'sort-proposals',
    templateUrl: './sort-proposals.component.html',
    styleUrls: ['./sort-proposals.component.scss'],
    imports: [MatFormFieldModule, MatSelectModule],
})
export class SortProposalsComponent {
    @Output() sortChange = new EventEmitter<'dateAsc' | 'dateDsc'>();

    onSortChange(criterion: 'dateAsc' | 'dateDsc') {
        this.sortChange.emit(criterion);
    }
}
