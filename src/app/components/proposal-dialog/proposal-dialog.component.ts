import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proposal } from '../../models/proposal.model';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { selectCurrentUserId, selectSelectedUser, selectUsers } from '../../../store/user/user.selectors';
import { Observable, take } from 'rxjs';
import { DataService } from '../../services/data.services';
import { Store } from '@ngrx/store';
import { rejectProposal } from '../../../store/proposal/proposal.actions';
import { counterProposal } from '../../../store/proposal/proposal.actions'; 
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { selectProposalState } from '../../../store/proposal/proposal.selector';

@Component({
  selector: 'proposal-dialog',
  templateUrl: './proposal-dialog.component.html',
  styleUrls: ['./proposal-dialog.component.css'],
  imports: [MatFormField, MatLabel, MatButton, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatInput],
})
export class ProposalDialogComponent {
  comment: string = '';
  paymentRatios: { [ownerId: number]: number } = {};
  currentUser$: Observable<User | null>
  currentUserId$: Observable<number | null>;
  users$: Observable<User[]>; 

  constructor(
    public dialogRef: MatDialogRef<ProposalDialogComponent>,
    private dataService: DataService,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) 
    public data: { selectedProposal: Proposal }
  ) {    
      this.currentUser$ = this.store.select(selectSelectedUser);
      this.currentUserId$ = this.store.select(selectCurrentUserId); 
      this.users$ = this.store.select(selectUsers); 
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitCounterProposal(): void {
    const item = this.data.selectedProposal;
  
    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      if (!item || !item.ownerIds || currentUser === null) return;
  
      this.users$.pipe(take(1)).subscribe(users => {
        const usersResponses: { userId: number; accept: boolean }[] = users
          .filter(user =>
            item.ownerIds.includes(user.partyId) && user.id !== currentUser.id)
          .map(user => ({ userId: user.id, accept: false }));
  
        if (!currentUser) {
          alert('You must select a user to submit a counterproposal.');
          return; 
        }
  
        const counterProposalData: Proposal = {
          id: Math.random().toString(36).substr(2, 9),
          itemId: item.itemId,
          userId: currentUser.id,
          ownerIds: item.ownerIds,
          creatorInfo: currentUser, 
          paymentRatios: item.ownerIds.reduce((acc, ownerId) => {
            acc[ownerId] = this.paymentRatios[ownerId] || 0;
            return acc;
          }, {} as { [key: number]: number }),
          comment: this.comment || '',
          createdAt: new Date(),
          status: 'Pending',
          counterProposalToId: item.id,
          usersResponses,
        };
  
        this.store.dispatch(counterProposal({
          proposalId: item.id,
          newProposal: counterProposalData
        }));

        this.store.select(selectProposalState).pipe(take(1)).subscribe(state => {
          if (state.creationSuccess) {
            alert("Counterproposal created successfully!");
          }
          if (state.creationError) {
            alert(`Error: ${state.creationError}`);
          }
        });

        this.store.dispatch(rejectProposal({ proposalId: item.id }));

        this.dialogRef.close(counterProposalData);
      });
    });
  }
}


    