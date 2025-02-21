import { Component } from '@angular/core';
import { HistoryContainerComponent } from '../proposal-history/history-container.component';
import { ItemsContainerComponent } from '../items-container/items-container.component';

@Component({
  selector: 'items-history-container',
  templateUrl: './items-history-container.component.html',
  styleUrls: ['./items-history-container.component.scss'],
  imports: [HistoryContainerComponent, ItemsContainerComponent],
})
export class ItemsHistoryConatinerComponent {

    constructor() {}
}
