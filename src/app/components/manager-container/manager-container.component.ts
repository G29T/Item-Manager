import { Component } from '@angular/core';
import { UserSwitchComponent } from '../user-switch/user-switch.component';
import { ItemsHistoryConatinerComponent } from '../items-history-container/items-history-container.component';

@Component({
    selector: 'manager-container',
    templateUrl: './manager-container.component.html',
    styleUrls: ['./manager-container.component.scss'],
    imports: [UserSwitchComponent, ItemsHistoryConatinerComponent]
})

export class ManagerContainerComponent {}