import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.services';
import { Item } from '../../models/items.model';
import { MatListModule } from '@angular/material/list';
import { ProposalFormComponent } from '../proposal-form/proposal-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  imports: [ProposalFormComponent, MatListModule, CommonModule],
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  selectedItem: Item | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadItems();
    console.log(this.items);
  }
  
  private async loadItems(): Promise<void> {
    try {
      this.items = await this.dataService.getItems();
      console.log('Loaded items:', this.items); 
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  onSelectItem(item: Item): void {
    this.selectedItem = item;
  }
}
