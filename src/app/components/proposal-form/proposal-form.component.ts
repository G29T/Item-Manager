import { Component, Input } from '@angular/core';
import { Item } from '../../models/items.model';
import { DataService } from '../../services/data.services';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'proposal-form',
    templateUrl: './proposal-form.component.html',
    styleUrls: ['./proposal-form.component.css'],
    imports: [MatLabel, MatFormField, FormsModule, MatInputModule, CommonModule]
})

export class ProposalFormComponent {
    @Input() item: Item | null = null;
    ratios: { [key: number]: number } = {};
    comment: string = '';

    constructor(public dataService: DataService) {}

    createProposal(): void {
        if (this.item) {
            this.dataService.createProposal(this.item.id, this.ratios, this.comment);
            this.resetForm();
        }
    }

    resetForm(): void {
        this.ratios = {};
        this.comment = '';
    }
}
