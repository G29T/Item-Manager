import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Proposal } from '../../models/proposal.model';
import { DataService } from '../../services/data.services';
import { Item } from '../../models/items.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCurrentUserId } from '../../../store/user/user.selectors';
import { take } from 'rxjs/operators'; 
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { createProposal } from '../../../store/proposal/proposal.actions';

@Component({
  selector: 'proposal-form',
  templateUrl: './proposal-form.component.html',
  styleUrls: ['./proposal-form.component.css'],
  imports: [ProposalFormComponent, MatFormField, MatLabel, FormsModule, CommonModule, MatFormFieldModule, MatInputModule],
})
export class ProposalFormComponent {
  @Input() item: Item | null = null;
  @Output() submitProposal = new EventEmitter<Proposal[]>();
  currentUserId$: Observable<number | null>;

  comment: string = '';
  paymentRatios: { [ownerId: number]: number } = {};

  constructor(private dataService: DataService, private store: Store) {
    this.currentUserId$ = this.store.select(selectCurrentUserId);
  }

  createProposal() {
    const item = this.item; 
    this.currentUserId$.pipe(take(1)).subscribe((userId) => {
      if (!item || !item.ownerIds || userId === null) return;

      const proposal: Proposal = {
        id: Math.random().toString(36).substr(2, 9),
        itemId: item.id,
        userId: userId,
        ownerIds: item.ownerIds,
        // paymentRatio: this.paymentRatios[ownerId] || 0,
        paymentRatios: item.ownerIds.reduce((acc, ownerId) => {
          acc[ownerId] = this.paymentRatios[ownerId] || 0;
          return acc;
        }, {} as { [key: number]: number }), 
        comment: this.comment || '',
        createdAt: new Date(),
        status: 'Pending',
      };


      console.log("PROPOSALS" + JSON.stringify(proposal));
      // this.submitProposal.emit(proposals);
      this.store.dispatch(createProposal({ proposal }));
    });
  }
}
