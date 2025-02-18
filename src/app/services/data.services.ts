import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators'; 
import { selectCurrentUserId } from '../../store/user/user.selectors'; 
import { Item } from '../models/items.model';
import { Owner } from '../models/owner.model';
import { User } from '../models/user.model';
import { LocalStorageService } from './local-storage.service';
import itemsJson from '../../assets/items.json'
import usersJson from '../../assets/users.json';
import ownersJson from '../../assets/owners.json';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private store: Store, private localStorageService: LocalStorageService) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    if (!this.localStorageService.loadFromLocalStorage('items')) {
      this.localStorageService.saveToLocalStorage('items', itemsJson);
    }
    if (!this.localStorageService.loadFromLocalStorage('users')) {
      this.localStorageService.saveToLocalStorage('users', usersJson);
    }
    if (!this.localStorageService.loadFromLocalStorage('owners')) {
      this.localStorageService.saveToLocalStorage('owners', ownersJson);
    }
  }

  getUsers(): Promise<User[]> {
    const users = this.localStorageService.loadFromLocalStorage<User[]>('users');
  
    if (!users) {
      console.warn('No users found in local storage.');
      return Promise.resolve([]); 
    } 
  
    return Promise.resolve(users); 
  }

  getOwners(): Promise<Owner[]>  {
    const owners = this.localStorageService.loadFromLocalStorage<Owner[]>('owners');

    if (!owners) {
      console.warn('No owners found in local storage.');
      return Promise.resolve([]); 
    } 
  
    return Promise.resolve(owners); 
  }

  getItems(): Promise<Item[]>  {
    const items = this.localStorageService.loadFromLocalStorage<Item[]>('items');
  
    if (!items) {
      console.warn('No items found in local storage.');
      return Promise.resolve([]); 
    } 
  
    return Promise.resolve(items);
  }
  
  async getItemsByUser(): Promise<Item[]> {
    const items =   this.getItems();
    
    const currentUserId = await this.getCurrentUserId();

    if (currentUserId === null) { 
      return [];
    }

    return (await items).filter(async item => item.ownerIds.includes(await this.getUserPartyId(currentUserId)));
  }

  private getCurrentUserId(): Promise<number | null> {
    return new Promise((resolve) => {
      this.store
        .select(selectCurrentUserId)
        .pipe(take(1)) 
        .subscribe(userId => {
          resolve(userId);
        });
    });
  }

  private async getUserPartyId(currentUserId: number): Promise<number> {
    const users = this.getUsers();
    const user = (await users).find(user => user.id === currentUserId);

    // console.log('users boolean ' + JSON.stringify(user?.partyId));
    return user ? user.partyId : 0;
  }

  // createProposal(itemId: number, ratios: { [key: number]: number }, comment: string): void {
  //   const currentUserId = this.store.select(selectCurrentUserId); 
  //   const proposal = {
  //     itemId,
  //     ratios,
  //     comment,
  //     createdAt: new Date(),
  //     createdBy: currentUserId, 
  //   };
  //   this.proposals.push(proposal);
  //   this.saveProposals();
  // }

  // private saveProposals(): void {
  //   localStorage.setItem('proposals', JSON.stringify(this.proposals));
  // }
}
