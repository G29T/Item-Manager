import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proposal } from '../../models/proposal.model';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { selectCurrentUserId, selectSelectedUser, selectUsers } from '../../../store/user/user.selectors';
import { Observable, take } from 'rxjs';
import { DataService } from '../../services/data.services';
import { Store } from '@ngrx/store';
import { rejectProposal } from '../../../store/proposal/proposal.actions';
import { counterProposal } from '../../../store/proposal/proposal.actions'; 
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { selectProposalState } from '../../../store/proposal/proposal.selector';
import { selectOwnerNameById } from '../../../store/owner/owner.selector';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'counterproposal-dialog',
  templateUrl: './counterproposal-dialog.component.html',
  styleUrls: ['./counterproposal-dialog.component.scss'],
  imports: [MatButtonModule, CommonModule, NgClass, NgIf ,FormsModule, MatFormFieldModule, MatInputModule, MatError],
})
export class CounterProposalDialogComponent {
  comment: string = '';
  paymentRatios: { [ownerId: number]: number } = {};
  paymentRatioErrors: { [ownerId:  number]: boolean } = {}; 
  totalPaymentRatio: number = 0;
  currentUser$: Observable<User | null>
  currentUserId$: Observable<number | null>;
  users$: Observable<User[]>; 

  constructor(
    public dialogRef: MatDialogRef<CounterProposalDialogComponent>,
    private dataService: DataService,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) 
    public data: { dialogTitle: string; selectedProposal: Proposal }
  ) {    
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
    return this.data.selectedProposal.ownerIds.some(owner => this.isPaymentRatioInvalid(owner));
  }
    
  isFormValid(): boolean {
    const allFieldsFilled = this.data.selectedProposal.ownerIds.every(owner => 
      this.paymentRatios[owner] !== undefined && 
      this.paymentRatios[owner] !== null && 
      this.paymentRatios[owner].toString().trim() !== ''
    ) && this.comment?.trim() !== ''; 
    
  
    return allFieldsFilled && this.totalPaymentRatio === 100 && !this.hasInvalidPaymentRatio();
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  submitCounterProposal(): void {
    if (!this.isFormValid()) {
      return; 
    }

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
          id: uuidv4(),
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
            alert(`${this.data.dialogTitle} created successfully!`);
            this.dialogRef.close();
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


    