import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../../app/services/data.services';
import { loadItems, loadItemsSuccess, loadItemsFailure, loadItemsByUser, loadItemsByUserSuccess, loadItemsByUserFailure } from './item.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Injectable()
export class ItemEffects {
  constructor(private actions$: Actions, private dataService: DataService) {}

  // load all items might not be necessary
  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems),
      tap(() => console.log('loadItems action dispatched')),
      switchMap(() => {
        return from(this.dataService.getItems()).pipe(
          tap((items) => console.log('Successfully Fetched items:', items)), 
          map((items) => loadItemsSuccess({ items })),
          catchError((error) => {
            console.error('Error fetching items:', error);
            return of(loadItemsFailure({ error }));
          })
        );
      })
    )
  );

  loadItemsByUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItemsByUser),
      // tap(({ userId }) => console.log(`Fetching items for user: ${userId}`)),
      switchMap(() => {
        return from(this.dataService.getItemsByUser()).pipe(
          tap((items) => console.log('Successfully fetched user-specific items:', items)), 
          map((items) => loadItemsByUserSuccess({ items })),
          catchError((error) => {
            console.error('Error fetching items for user:', error);
            return of(loadItemsByUserFailure({ error }));
          })
        );
      })
    )
  );
}
