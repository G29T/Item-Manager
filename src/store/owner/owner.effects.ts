import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../../app/services/data.services';
import { loadOwners, loadOwnersSuccess, loadOwnersFailure } from './owner.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable()
export class OwnerEffects {
    constructor(private actions$: Actions, private dataService: DataService) {}

    loadOwners$ = createEffect(() =>
        this.actions$.pipe(
          ofType(loadOwners),
          tap(() => console.log('loadOwners action dispatched')),
          switchMap(() => 
            from(this.dataService.getOwners()).pipe(
              tap((owners) => console.log('Successfully fetched owners:', owners)),
              map((owners) => loadOwnersSuccess({ owners })),
              catchError((error) => {
                console.error('Error fetching owners:', error);
                return of(loadOwnersFailure({ error }));
              })
            )
          )
        )
    );
}
