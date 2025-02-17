import { Component, Input } from '@angular/core';
import { Proposal } from '../../models/proposal.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { map, Observable, switchMap } from 'rxjs';
import { DataService } from '../../services/data.services';
import { Store } from '@ngrx/store';
import { selectProposalsForItem } from '../../../store/proposal/proposal.selector';
import { selectSelectedItem } from '../../../store/item/item.selectors';
import { Item } from '../../models/items.model';

@Component({
  selector: 'proposal-history',
  templateUrl: './proposal-history.component.html',
  styleUrls: ['./proposal-history.component.css'],
  imports: [AsyncPipe, CommonModule],    
})
export class ProposalHistoryComponent {
  proposalsByItem$: Observable<Proposal[] | null>;
  selectedItem$: Observable<Item | null>;

  constructor(private dataService: DataService, private store: Store) {
    this.selectedItem$ = this.store.select(selectSelectedItem);
    this.proposalsByItem$ = this.selectedItem$.pipe(
      switchMap((item) => {
        if (!item) {
          //[] instead of [null]
          return [null];
        }
        
        return this.store.select(selectProposalsForItem(item.id));
      })
    );
  } 
  // @Input() proposals!: Proposal[];
}
