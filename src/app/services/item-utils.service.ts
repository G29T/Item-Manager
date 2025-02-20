import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectProposalsForItem } from '../../store/proposal/proposal.selector';
import { Item } from '../models/items.model';
import { selectCurrentUserId } from '../../store/user/user.selectors';


@Injectable({
  providedIn: 'root',
})
export class ItemUtilsService {
    currentUserId$: Observable<number | null>;

    constructor(private store: Store) {
        this.currentUserId$ = this.store.select(selectCurrentUserId);
    }

    hasPendingProposals(itemId: number): Observable<boolean> {
        return this.store.select(selectProposalsForItem(itemId)).pipe(
        switchMap((proposals) => {
            if (!proposals) return of(false);
            
            return this.currentUserId$.pipe(
            map((currentUserId) => {
                if (currentUserId === null) return false; 

                const userProposals = proposals[currentUserId] || [];
                return userProposals.some(proposal => proposal.status === 'Pending');
            })
            );
        })
        );
    }

    sortByCriterion(items: Item[], criterion: 'nameAsc' | 'nameDsc' | 'costAsc' | 'costDsc' | 'pendingStatus'): Item[] {
        switch (criterion) {
        case 'nameAsc':
            return [...items].sort((a, b) => a.name.localeCompare(b.name)); 
        case 'nameDsc':
            return [...items].sort((a, b) => b.name.localeCompare(a.name));
        case 'costAsc':
            return [...items].sort((a, b) => a.totalCost - b.totalCost);
        case 'costDsc':
            return [...items].sort((a, b) => b.totalCost - a.totalCost);
        case 'pendingStatus':
            return [...items].sort((a, b) => (b.hasPending ? 1 : 0) - (a.hasPending ? 1 : 0));
        default:
            return items;
        }
    }
}
