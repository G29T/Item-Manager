import { Component } from '@angular/core';
import { Proposal } from '../../models/proposal.model';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { BehaviorSubject, firstValueFrom, map, Observable, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectProposalsForItem } from '../../../store/proposal/proposal.selector';
import { selectSelectedItem } from '../../../store/item/item.selectors';
import { Item } from '../../models/items.model';
import { MatDialog } from '@angular/material/dialog';
import { selectCurrentUserId, selectCurrentUserPartyId, selectSelectedUser, selectUsers } from '../../../store/user/user.selectors';
import { Owner } from '../../models/owner.model';
import { selectOwnerNameById, selectOwners } from '../../../store/owner/owner.selector';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { FilterProposalsComponent } from '../filter-proposals/filter-proposals.component';
import { SortProposalsComponent } from '../sort-proposals/sort-proposals.component';
import { ProposalListComponent } from '../proposal-list/proposal-list.component';


@Component({
  selector: 'history-container',
  templateUrl: './history-container.component.html',
  styleUrls: ['./history-container.component.scss'],
  imports: [AsyncPipe, CommonModule, FormsModule, NgIf, MatFormFieldModule, MatOptionModule, 
    MatSelectModule, MatListModule, MatCardModule, MatIconModule, FilterProposalsComponent,
    SortProposalsComponent, ProposalListComponent
  ],
})
export class HistoryContainerComponent {
  selectedItem$: Observable<Item | null>;
  currentUserId$: Observable<number | null>;
  proposalsByItem$: Observable<Proposal[] | null>;
  owners$: Observable<Owner[]>;
  currentUserPartyId$: Observable<number>;
  private sortedProposals: Proposal[] = []; 
  sortingCriterion: 'dateAsc' | 'dateDsc' = 'dateDsc';
  private filterStatusSubject = new BehaviorSubject<'Pending' | 'Accepted' | 'Rejected'  | 'Withdrawn' | 'Finalised' | '' | null>(null);
  filterStatus$ = this.filterStatusSubject.asObservable();

  constructor(private store: Store, private dialog: MatDialog) {
    this.currentUserId$ = this.store.select(selectCurrentUserId);
    this.owners$ = this.store.select(selectOwners);
    this.selectedItem$ = this.store.select(selectSelectedItem);
    this.currentUserPartyId$ = this.store.select(selectCurrentUserPartyId);
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

  get filterStatusValue(): 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn' | 'Finalised' | '' | null {
    return this.filterStatusSubject.value;
  }

  getPartyMembers(): Observable<User[]> {
    return this.currentUserPartyId$.pipe(
      switchMap((partyId) => {
        if (partyId === null) return of([]); 

        return this.store.select(selectUsers).pipe(
          map(users => {
            return users.filter(user => user.partyId === partyId); 
          })
        );
      })
    );
  }
  
  getAcceptedPartyMembers(proposal: Proposal): Observable<User[]> {
    return this.getPartyMembers().pipe(
      switchMap((usersFromSameParty) => {
        const acceptedUserIds = proposal.usersResponses
          .filter(response => response.accept)
          .map(response => response.userId);

        const acceptedUsers = usersFromSameParty.filter(user =>
          acceptedUserIds.includes(user.id) 
        );
  
        return of(acceptedUsers); 
      })
    );
  }

  getOwnerNameById(ownerId: number): Observable<string> {
    return this.store.select(selectOwnerNameById(ownerId));
  }

  setFilterStatus(status: 'Pending' | 'Accepted' | 'Rejected'  | 'Withdrawn' | 'Finalised' | '' | null) {
    this.filterStatusSubject.next(status);
    this.updateFilteredProposals();
  }

  private updateFilteredProposals() {
    this.proposalsByItem$ = this.proposalsByItem$.pipe(
        map((currentProposals) => {
            if (currentProposals) {
                return this.filterProposals(currentProposals);
            }
            return []; 
        })
    );
  }

  setSortingCriterion(criterion: 'dateAsc' | 'dateDsc') {
    this.sortingCriterion = criterion;
    this.sortedProposals = this.sortByCriterion(this.sortedProposals, this.sortingCriterion); 
    this.proposalsByItem$ = this.proposalsByItem$.pipe(
        map(() => this.filterProposals(this.sortedProposals)) 
    );
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
}
