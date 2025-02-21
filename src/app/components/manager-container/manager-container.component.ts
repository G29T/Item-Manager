import { Component, OnInit } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UsersState } from '../../../store/user/user.reducer';
import { UserSwitchComponent } from '../user-switch/user-switch.component';
import { ItemsHistoryConatinerComponent } from '../items-history-container/items-history-container.component';

@Component({
    selector: 'manager-container',
    templateUrl: './manager-container.component.html',
    styleUrls: ['./manager-container.component.scss'],
    imports: [UserSwitchComponent, ItemsHistoryConatinerComponent]
})

export class ManagerContainerComponent implements OnInit {

    constructor(private store: Store<UsersState>) {
    }

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}