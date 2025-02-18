import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Proposal } from '../../models/proposal.model';
import { Item } from '../../models/items.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCurrentUserId, selectUsers } from '../../../store/user/user.selectors';
import { take } from 'rxjs/operators'; 
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInput, MatInputModule } from '@angular/material/input';
import { createProposal } from '../../../store/proposal/proposal.actions';
import { User } from '../../models/user.model';
import { selectProposalState } from '../../../store/proposal/proposal.selector';

@Component({
  selector: 'proposal-form',
  templateUrl: './proposal-form.component.html',
  styleUrls: ['./proposal-form.component.css'],
  imports: [ProposalFormComponent, MatFormField, MatLabel, FormsModule, MatInput, CommonModule, MatFormFieldModule, MatInputModule],
})
export class ProposalFormComponent {
  @Input() item: Item | null = null;
  @Output() submitProposal = new EventEmitter<Proposal[]>();
  currentUserId$: Observable<number | null>;
  users$: Observable<User[]>; 

  comment: string = '';
  paymentRatios: { [ownerId: number]: number } = {};
  proposalCreationSuccess: boolean | null = null; 
  proposalCreationError: string | null = null; 

  constructor(private store: Store) {
    this.currentUserId$ = this.store.select(selectCurrentUserId);
    this.users$ = this.store.select(selectUsers); 
  }


  createProposal(): void {
    const item = this.item; 
    this.currentUserId$.pipe(take(1)).subscribe((userId) => {
      if (!item || !item.ownerIds || userId === null) return;

      this.users$.pipe(take(1)).subscribe(users => {
        const usersResponses: { userId: number; accept: boolean }[] = users
          .filter(user => 
            item.ownerIds.includes(user.partyId) && user.id !== userId)
          .map(user => ({ userId: user.id, accept: false }));
  
        const proposal: Proposal = {
          id: Math.random().toString(36).substr(2, 9),
          itemId: item.id,
          userId: userId,
          ownerIds: item.ownerIds,
          paymentRatios: item.ownerIds.reduce((acc, ownerId) => {
            acc[ownerId] = this.paymentRatios[ownerId] || 0;
            return acc;
          }, {} as { [key: number]: number }), 
          comment: this.comment || '',
          createdAt: new Date(),
          status: 'Pending',
          usersResponses: usersResponses,
        };
  
        this.store.dispatch(createProposal({ proposal }));
        
        this.store.select(selectProposalState).pipe(take(1)).subscribe(state => {
          if (state.creationSuccess) {
            alert("Proposal created successfully!");
          }
          if (state.creationError) {
            alert(`Error: ${state.creationError}`);
          }
        });
      });
    });
  }
}  