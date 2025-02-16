import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../../app/services/data.services';
import { loadItems, loadItemsSuccess, loadItemsFailure } from './item.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Injectable()
export class ItemEffects {
  constructor(private actions$: Actions, private dataService: DataService) {}

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
}
