import { Component, OnInit } from '@angular/core';
import { Proposal } from '../../models/proposal.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { DataService } from '../../services/data.services';
import { Store } from '@ngrx/store';
import { selectProposalsForItem } from '../../../store/proposal/proposal.selector';
import { selectSelectedItem } from '../../../store/item/item.selectors';
import { Item } from '../../models/items.model';
import { MatDialog } from '@angular/material/dialog';
import { ProposalDialogComponent } from '../proposal-dialog/proposal-dialog.component';
import { acceptProposal, setBackToPendingProposal, withdrawProposal } from '../../../store/proposal/proposal.actions';
import { selectCurrentUserId } from '../../../store/user/user.selectors';
import { Owner } from '../../models/owner.model';
import { selectOwners } from '../../../store/owner/owner.selector';

@Component({
  selector: 'proposal-history',
  templateUrl: './proposal-history.component.html',
  styleUrls: ['./proposal-history.component.css'],
  imports: [AsyncPipe, CommonModule],    
})
export class ProposalHistoryComponent {
  selectedItem$: Observable<Item | null>;
  currentUserId$: Observable<number | null>;
  proposalsByItem$: Observable<Proposal[] | null>;
  owners$: Observable<Owner[]>;

  constructor(private dataService: DataService, private store: Store, private dialog: MatDialog) {
    this.currentUserId$ = this.store.select(selectCurrentUserId);
    this.owners$ = this.store.select(selectOwners);
    this.selectedItem$ = this.store.select(selectSelectedItem);
    this.proposalsByItem$ = this.selectedItem$.pipe(
      switchMap((item) => {
        if (!item) {
          return [null];
        }
    
        return this.store.select(selectProposalsForItem(item.id)).pipe(
          switchMap((proposals) => {
            if (!proposals) return of([]);
    
            return this.currentUserId$.pipe(
              map((currentUserId) => {
                if (currentUserId === null) return []; 
    
                const userProposals = proposals[currentUserId] || [];
    
                return userProposals.length > 0 
                  ? userProposals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  : []; 
              })
            );
          })
        );
      })
    );
  } 

  getOwnerNameById(ownerId: number): Observable<string> {
    return this.owners$.pipe(
      map(owners => {
        const owner = owners.find(owner => owner.id === ownerId);
        return owner ? owner.name : 'Unknown Owner';
      })
    );
  }

  openCounterProposalDialog(proposal: Proposal): void {
    const dialogRef = this.dialog.open(ProposalDialogComponent, {
      width: '400px',
      data: {
        selectedProposal: proposal, 
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Counter proposal submitted:', result);
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
