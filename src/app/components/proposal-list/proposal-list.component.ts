import { Component, Input } from '@angular/core';
import { Proposal } from '../../models/proposal.model';
import { Observable, take } from 'rxjs';
import { User } from '../../models/user.model';
import { selectCurrentUserId, selectCurrentUserPartyId } from '../../../store/user/user.selectors';
import { Store } from '@ngrx/store';
import { CounterProposalDialogComponent } from '../counterproposal-dialog/counterproposal-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { acceptProposal, setBackToPendingProposal, withdrawProposal } from '../../../store/proposal/proposal.actions';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.scss'],
  imports: [AsyncPipe, CommonModule, FormsModule, NgIf, MatFormFieldModule, 
    MatOptionModule, MatSelectModule, MatListModule, MatCardModule, MatIconModule
  ],
})
export class ProposalListComponent {
    @Input() proposals!: Proposal[];
    @Input() getAcceptedPartyMembers!: (proposal: Proposal) => Observable<User[]>;
    @Input() getOwnerNameById!: (ownerId: number) => Observable<string>;
    currentUserId$: Observable<number | null>;
    currentUserPartyId$: Observable<number>;

    constructor(private store: Store, private dialog: MatDialog) {
        this.currentUserId$ = this.store.select(selectCurrentUserId);
        this.currentUserPartyId$ = this.store.select(selectCurrentUserPartyId);
    }
    
    openCounterProposalDialog(proposal: Proposal): void {
        const previouslyFocusedElement = document.activeElement as HTMLElement;

        const dialogRef = this.dialog.open(CounterProposalDialogComponent, {
            width: '400px',
            data: {
                dialogTitle: 'Counterproposal',
                selectedProposal: proposal,
            },
        });
    
        dialogRef.afterClosed().subscribe(() => {
            if (previouslyFocusedElement) {
                previouslyFocusedElement.focus();
            }
        });
    }
    
    withdrawProposal(proposal: Proposal): void {
        this.currentUserId$.pipe(take(1)).subscribe(userId => {
            if (userId !== null) {
                this.store.dispatch(withdrawProposal({ proposalId: proposal.id }));

                if (proposal.counterProposalToId) {
                    this.store.dispatch(setBackToPendingProposal({ proposalId: proposal.counterProposalToId }));
                }
            } else {
                console.error('User ID is null, cannot withdraw proposal');
            }
        });
    }
    
    acceptProposal(proposal: Proposal): void {
        this.currentUserId$.pipe(take(1)).subscribe(userId => {
            if (userId !== null) {
                this.store.dispatch(acceptProposal({ proposalId: proposal.id, userId }));
            } else {
                console.error('User ID is null, cannot accept proposal');
            }
        });
    }
}
