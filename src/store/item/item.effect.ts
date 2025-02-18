import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../../app/services/data.services';
import { loadItems, loadItemsSuccess, loadItemsFailure, loadItemsByUser, loadItemsByUserSuccess, loadItemsByUserFailure } from './item.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Injectable()
export class ItemEffects {
  constructor(private actions$: Actions, private dataService: DataService) {}

  private addSharedFlagToItems(items: any[], users: any[]): any[] {
    return items.map(item => ({
      ...item,
      isShared: users.some(user => item.ownerIds.includes(user.partyId))
    }));
  }

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems),
      switchMap(() =>
        from(this.dataService.getItems()).pipe(
          switchMap((items) =>
            from(this.dataService.getUsers()).pipe(
              map((users) => {
                const enrichedItems = this.addSharedFlagToItems(items, users);
                return loadItemsSuccess({ items: enrichedItems });
              })
            )
          ),
          catchError((error) => {
            console.error('Error fetching items:', error);
            return of(loadItemsFailure({ error }));
          })
        )
      )
    )
  );

  loadItemsByUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItemsByUser),
      switchMap(() =>
        from(this.dataService.getItemsByUser()).pipe(
          switchMap((items) =>
            from(this.dataService.getUsers()).pipe(
              map((users) => {
                const enrichedItems = this.addSharedFlagToItems(items, users);
                return loadItemsByUserSuccess({ items: enrichedItems });
              })
            )
          ),
          catchError((error) => {
            console.error('Error fetching items for user:', error);
            return of(loadItemsByUserFailure({ error }));
          })
        )
      )
    )
  );
}
