import { Component, EventEmitter, Output } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'filter-proposals',
    templateUrl: './filter-proposals.component.html',
    styleUrls: ['./filter-proposals.component.scss'],
    imports: [MatFormFieldModule, MatOptionModule, MatSelectModule],
})
export class FilterProposalsComponent {
    @Output() filterChange = new EventEmitter<'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn' | 'Finalised' | '' | null>();

    onFilterChange(value: '' | 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn' | 'Finalised' | null) {
        this.filterChange.emit(value);
    }
}
