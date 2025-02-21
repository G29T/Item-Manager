import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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

  // @ViewChild('itemsContainer', { static: false }) itemsContainer!: ElementRef;
  
  constructor(private eRef: ElementRef) {}
  
    isItemsVisible: boolean = false;
    isSmallScreen: boolean = window.innerWidth <= 1023;
  
    toggleItemsContainer() {
      this.isItemsVisible = !this.isItemsVisible;
    }

    // @HostListener('document:click', ['$event'])
    // handleClickOutside(event: MouseEvent) {
    //   const target = event.target as HTMLElement;

    //   if (this.isSmallScreen && this.isItemsVisible && this.itemsContainer) {
    //     const itemsContainerElement = this.itemsContainer.nativeElement;
    //     if (!itemsContainerElement.contains(target)) {
    //       this.isItemsVisible = false; 
    //     }
    //   }
    // }
  
    @HostListener('window:resize', ['$event'])
    onResize() {
      this.isSmallScreen = window.innerWidth <= 1023;
    }
}
