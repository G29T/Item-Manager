import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loadItems, loadItemsByUser, selectItem } from '../../../store/item/item.actions';
import { loadUsers, setCurrentUser } from '../../../store/user/user.actions';
import { selectCurrentUserId, selectUsers } from '../../../store/user/user.selectors';
import { map, Observable, take } from 'rxjs';
import { UsersState } from '../../../store/user/user.reducer';

@Component({
    selector: 'user-switch',
    templateUrl: './user-switch.component.html',
    styleUrls: ['./user-switch.component.css'],
    imports: [CommonModule, FormsModule, MatSelectModule, MatOptionModule]
})

export class UserSwitchComponent implements OnInit {
    users$: Observable<User[]>;
    selectedUserId: number | null = null;

    constructor(private store: Store<UsersState>) {
        this.users$ = this.store.select(selectUsers);
    }

    ngOnInit(): void {
        this.store.dispatch(loadUsers());
        this.store.dispatch(loadItems());
    }

    switchUser(userId: number): void {
        this.store.dispatch(setCurrentUser({ userId })); 
        this.store.dispatch(selectItem({ item: null })); 
    
        this.store.select(selectCurrentUserId).pipe(
            take(1),
            map(currentUserId => {
                console.log('Current User ID from Store:', currentUserId);
                return currentUserId;
            })
        ).subscribe(currentUserId => {
            if (currentUserId === userId) {
                console.log('User ID is set correctly. Loading items...');
                this.store.dispatch(loadItemsByUser());
            } else {
                console.warn('User ID was not set correctly. Items will not be loaded.');
            }
        });
    }
}
