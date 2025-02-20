import { Component, Output, EventEmitter, Input, OnInit, Inject } from '@angular/core';
import { Proposal } from '../../models/proposal.model';
import { Item } from '../../models/items.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCurrentUserId, selectSelectedUser, selectUsers } from '../../../store/user/user.selectors';
import { take } from 'rxjs/operators'; 
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInput, MatInputModule } from '@angular/material/input';
import { createProposal } from '../../../store/proposal/proposal.actions';
import { User } from '../../models/user.model';
import { selectProposalState } from '../../../store/proposal/proposal.selector';
import { UsersState } from '../../../store/user/user.reducer';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { selectOwnerNameById } from '../../../store/owner/owner.selector';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'proposal-dialog',
  templateUrl: './proposal-dialog.component.html',
  styleUrls: ['./proposal-dialog.component.scss'],
  imports: [MatFormField, MatLabel, FormsModule, MatInput, CommonModule, MatFormFieldModule, MatInputModule],
})
export class ProposalDialogComponent {
  @Output() submitProposal = new EventEmitter<Proposal[]>();
  currentUser$: Observable<User | null>
  currentUserId$: Observable<number | null>;
  users$: Observable<User[]>; 

  comment: string = '';
  paymentRatios: { [ownerId: number]: number } = {};
  paymentRatioErrors: { [ownerId:  number]: boolean } = {}; 
  totalPaymentRatio: number = 0;
  proposalCreationSuccess: boolean | null = null; 
  proposalCreationError: string | null = null; 

  constructor(
    public dialogRef: MatDialogRef<ProposalDialogComponent>,
    private store:  Store<UsersState>,
    @Inject(MAT_DIALOG_DATA) 
    public data: { dialogTitle: string; item: Item }
  ) {    
      if (!data.item) {
        dialogRef.close(); // Close the dialog if there's no item
      }

      this.currentUser$ = this.store.select(selectSelectedUser);
      this.currentUserId$ = this.store.select(selectCurrentUserId);
      this.users$ = this.store.select(selectUsers); 
    }

  getOwnerNameById(ownerId: number): Observable<string> {
    return this.store.select(selectOwnerNameById(ownerId));
  }
  
  calculateTotalPaymentRatio(): void {
    this.totalPaymentRatio = Object.values(this.paymentRatios).reduce((acc, val) => acc + (val || 0), 0);
    
    Object.keys(this.paymentRatios).forEach(key => {
      const ownerId = Number(key); 
      const value = this.paymentRatios[ownerId] || 0;
      this.paymentRatioErrors[ownerId] = value < 0 || value > 100;
    });
  }

  isPaymentRatioInvalid(ownerId: number): boolean {
    return this.paymentRatioErrors[ownerId];
  }

  hasInvalidPaymentRatio(): boolean {
    return this.data.item.ownerIds.some(owner => this.isPaymentRatioInvalid(owner));
  }
      
  isFormValid(): boolean {
    const allFieldsFilled = this.data.item.ownerIds.every(owner => 
      this.paymentRatios[owner] !== undefined && 
      this.paymentRatios[owner] !== null && 
      this.paymentRatios[owner].toString().trim() !== ''
    ) && this.comment?.trim() !== ''; 
    
  
    return allFieldsFilled && this.totalPaymentRatio === 100 && !this.hasInvalidPaymentRatio();
  }
    
  onNoClick(): void {
    this.dialogRef.close();
  }
      
  createProposal(): void {
    if (!this.isFormValid()) {
      return;
    }

    const item = this.data.item;
    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      if (!item || !item.ownerIds || currentUser === null) return;
  
      this.users$.pipe(take(1)).subscribe(users => {
        const usersResponses: { userId: number; accept: boolean }[] = users
          .filter(user => 
            item.ownerIds.includes(user.partyId) && user.id !== currentUser.id)
          .map(user => ({ userId: user.id, accept: false }));
  
        if (!currentUser) {
          alert('You must select a user');
          return;
        }
  
        const proposal: Proposal = {
          id: uuidv4(),
          itemId: item.id,
          userId: currentUser.id,
          creatorInfo: currentUser,
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
            alert(`${this.data.dialogTitle} created successfully!`);
            this.dialogRef.close();
          }
          if (state.creationError) {
            alert(`Error: ${state.creationError}`);
          }
        });
      });
    });
  }
}  