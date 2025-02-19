import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadUsers, loadUsersFailure, loadUsersSuccess } from './user.actions';
import { DataService } from '../../app/services/data.services';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private dataService: DataService) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      tap(() => console.log('loadUsers action dispatched')),
      switchMap(() => 
        from(this.dataService.getUsers()).pipe(
          tap((users) => console.log('Successfully fetched users:', users)),
          map((users) => loadUsersSuccess({ users })),
          catchError((error) => {
            console.error('Error fetching users:', error);
            return of(loadUsersFailure({ error }));
          })
        )
      )
    )
  );
}

