// Accessing localStorage is generally a synchronous operation
// However effect is useful for future functionalities which may involve any asynchronous operations 
// Moreover it keeps a consistent pattern for handling data loading across the application

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as ProposalActions from './proposal.actions';
import { DataService } from '../../app/services/data.services';
import { loadProposals, loadProposalsFailure, loadProposalsSuccess } from './proposal.actions';

@Injectable()
export class ProposalEffects {
  constructor(private actions$: Actions, private dataService: DataService) {}

    loadProposals$ = createEffect(() =>
        this.actions$.pipe(
          ofType(loadProposals),
          tap(() => console.log('loadProposals action dispatched')),
          switchMap(() => 
            of(this.dataService.getProposalsFromLocalStorage()).pipe( 
              tap((proposals) => console.log('Successfully fetched proposals:', proposals)),
              map((proposals) => loadProposalsSuccess({ proposals })),
              catchError((error) => {
                console.error('Error fetching proposals:', error);
                return of(loadProposalsFailure({ error }));
              })
            ))
          
        )
    );
}