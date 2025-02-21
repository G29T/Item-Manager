import { Component, ElementRef, HostListener } from '@angular/core';
import { HistoryContainerComponent } from '../proposal-history/history-container.component';
import { ItemsContainerComponent } from '../items-container/items-container.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'items-history-container',
  templateUrl: './items-history-container.component.html',
  styleUrls: ['./items-history-container.component.scss'],
  imports: [HistoryContainerComponent, ItemsContainerComponent, NgIf, MatIconModule],
})
export class ItemsHistoryConatinerComponent {

  constructor(private eRef: ElementRef) {}
  
    isItemsVisible: boolean = false;
    isSmallScreen: boolean = window.innerWidth <= 1023;
  
    toggleItemsContainer() {
      this.isItemsVisible = !this.isItemsVisible;
    }
  
    onItemsContainerClick() {
      this.isItemsVisible = false; 
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
      if (this.isSmallScreen && this.isItemsVisible && !this.eRef.nativeElement.contains(event.target)) {
        this.isItemsVisible = false;
      }
    }
  
    @HostListener('window:resize', ['$event'])
    onResize() {
      this.isSmallScreen = window.innerWidth <= 1023;
    }
}
