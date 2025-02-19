import { Component } from '@angular/core';
import { Proposal } from '../../models/proposal.model';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { BehaviorSubject, map, Observable, of, switchMap, take } from 'rxjs';
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
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'proposal-history',
  templateUrl: './proposal-history.component.html',
  styleUrls: ['./proposal-history.component.css'],
  imports: [AsyncPipe, CommonModule, FormsModule, NgIf, MatFormField, MatLabel, MatOptionModule, MatSelectModule],
})
export class ProposalHistoryComponent {
  selectedItem$: Observable<Item | null>;
  currentUserId$: Observable<number | null>;
  proposalsByItem$: Observable<Proposal[] | null>;
  owners$: Observable<Owner[]>;
  private sortedProposals: Proposal[] = []; 
  sortingCriterion: 'dateAsc' | 'dateDsc' = 'dateDsc';
  private filterStatusSubject = new BehaviorSubject<'Pending' | 'Accepted' | 'Rejected'  | 'Withdrawn' | 'FinalisedAccepted' | '' | null>(null);
  filterStatus$ = this.filterStatusSubject.asObservable();

  constructor(private store: Store, private dialog: MatDialog) {
    this.currentUserId$ = this.store.select(selectCurrentUserId);
    this.owners$ = this.store.select(selectOwners);
    this.selectedItem$ = this.store.select(selectSelectedItem);
    this.proposalsByItem$ = this.selectedItem$.pipe(
      switchMap((item) => {
        if (!item) {
          return of(null);
        }
        return this.store.select(selectProposalsForItem(item.id)).pipe(
          switchMap((proposals) => {
            if (!proposals) return of([]);

            return this.currentUserId$.pipe(
              map((currentUserId) => {
                if (currentUserId === null) return [];

                const userProposals = proposals[currentUserId] || [];
                this.sortedProposals = this.sortByCriterion(userProposals, this.sortingCriterion);
                return this.sortedProposals;
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

  setSortingCriterion(criterion: 'dateAsc' | 'dateDsc') {
    this.sortingCriterion = criterion;
    this.sortedProposals = this.sortByCriterion(this.sortedProposals, this.sortingCriterion); 
    this.updateFilteredProposals(); 
  }

  setFilterStatus(status: 'Pending' | 'Accepted' | 'Rejected'  | 'Withdrawn' | 'FinalisedAccepted' | '' | null) {
    this.filterStatusSubject.next(status);
    this.updateFilteredProposals();
  }

  private updateFilteredProposals() {
    this.proposalsByItem$ = of(this.filterProposals(this.sortedProposals)); 
  }

  private filterProposals(proposals: Proposal[]): Proposal[] {
    const status = this.filterStatusSubject.value; 

    if (status === null || status === '') {
      return proposals;
    }
    if (status) {
      return proposals.filter(proposal => proposal.status === status);
    }
    return proposals; 
  }

  private sortByCriterion(proposals: Proposal[], criterion: 'dateAsc' | 'dateDsc'): Proposal[] {
    switch (criterion) {
      case 'dateAsc':
        return [...proposals].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'dateDsc':
        return [...proposals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return proposals;
    }
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
