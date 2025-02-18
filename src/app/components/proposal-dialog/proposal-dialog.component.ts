import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proposal } from '../../models/proposal.model';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { selectCurrentUserId } from '../../../store/user/user.selectors';
import { Observable, take } from 'rxjs';
import { DataService } from '../../services/data.services';
import { Store } from '@ngrx/store';
import { rejectProposal } from '../../../store/proposal/proposal.actions';
import { counterProposal } from '../../../store/proposal/proposal.actions'; 
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';

@Component({
  selector: 'proposal-dialog',
  templateUrl: './proposal-dialog.component.html',
  styleUrls: ['./proposal-dialog.component.css'],
  imports: [MatFormField, MatLabel, MatButton, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatInput],
})
export class ProposalDialogComponent implements OnInit {
  comment: string = '';
  paymentRatios: { [ownerId: number]: number } = {};
  currentUserId$: Observable<number | null>;
  usersFromFile: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProposalDialogComponent>,
    private dataService: DataService,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) 
    public data: { selectedProposal: Proposal }
  ) {    
    this.currentUserId$ = this.store.select(selectCurrentUserId); 
  }

  async ngOnInit() {
    this.usersFromFile = await this.dataService.getUsers();
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  submitCounterProposal(): void {
    const item = this.data.selectedProposal; 
    
    this.currentUserId$.pipe(take(1)).subscribe((userId) => {
        if (!item || !item.ownerIds || userId === null) return;

    //  don't include the current user
        const usersResponses: { userId: number; accept: boolean }[] = this.usersFromFile
            .filter(user => 
            item.ownerIds.includes(user.partyId) && user.id !== userId)
            .map(user => ({ userId: user.id, accept: false }));

        const counterProposalData: Proposal = {
            id: Math.random().toString(36).substr(2, 9),
            itemId: item.itemId,
            userId: userId,
            ownerIds: item.ownerIds,
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

        this.store.dispatch(rejectProposal({ proposalId: item.id }));
        
        this.dialogRef.close(counterProposalData);
    });
  }
}
