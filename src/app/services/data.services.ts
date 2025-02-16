// import { Injectable } from '@angular/core';
// import { Item } from '../models/items.model';
// import { Owner } from '../models/owner.model';
// import { User } from '../models/user.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class DataService {
//   private currentUserId: number | null = null;
//   private items: Item[] = [];
//   private owners: Owner[] = [];
//   private users: User[] = [];
//   private proposals: any[] = [];

//   constructor() {
//     this.loadInitialData();
//   }

//   private async loadInitialData(): Promise<void> {
//     try {
//       this.items = await this.loadJSON<Item[]>('assets/items.json');
//       this.owners = await this.loadJSON<Owner[]>('assets/owners.json');
//       this.users = await this.loadJSON<User[]>('assets/users.json');
//     } catch (error) {
//       console.error('Error loading initial data:', error);
//     }
//   }

//   private async loadJSON<T>(url: string): Promise<T> {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Network response was not ok: ${response.statusText}`);
//     }
//     return await response.json();
//   }

//   async getItems(): Promise<Item[]> {
//     await this.loadInitialData();

//     if (this.currentUserId === null) {
//       console.log("user id in IF " + this.currentUserId);
//       return [];
//     }

//     return this.items.filter(item => item.ownerIds.includes(this.getUserPartyId()));
//   }

//   async getOwners(): Promise<Owner[]> {
//     await this.loadInitialData();
//     return this.owners;
//   }

//   async getUsers(): Promise<User[]> {
//     await this.loadInitialData();
//     return this.users;
//   }

//   setCurrentUser(userId: number): void {
//     this.currentUserId = userId;
//   }

//   getUserId(): number | null {
//     console.log("user id in get Items " + this.currentUserId);
//     return this.currentUserId;
//   }

//   getUserPartyId(): number {
//     const user = this.users.find(u => u.id === this.currentUserId);
//     console.log('users boolean ' + JSON.stringify(user?.partyId));
//     return user ? user.partyId : 0;
//   }

//   createProposal(itemId: number, ratios: { [key: number]: number }, comment: string): void {
//     const proposal = {
//       itemId,
//       ratios,
//       comment,
//       createdAt: new Date(),
//       createdBy: this.currentUserId,
//     };
//     this.proposals.push(proposal);
//     this.saveProposals();
//   }

//   private saveProposals(): void {
//     localStorage.setItem('proposals', JSON.stringify(this.proposals));
//   }
// }


import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators'; 
import { selectCurrentUserId } from '../../store/user/user.selectors'; 
import { Item } from '../models/items.model';
import { Owner } from '../models/owner.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private items: Item[] = [];
  private owners: Owner[] = [];
  private users: User[] = [];
  private proposals: any[] = [];

  constructor(private store: Store) {
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    try {
      this.items = await this.loadJSON<Item[]>('assets/items.json');
      this.owners = await this.loadJSON<Owner[]>('assets/owners.json');
      this.users = await this.loadJSON<User[]>('assets/users.json');
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  private async loadJSON<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return await response.json();
  }

  async getItems(): Promise<Item[]> {
    await this.loadInitialData();
    return this.items;
  }

  // async getUserItems(): Promise<Item[]> {
  //   await this.loadInitialData();

  //   const currentUserId = await this.getCurrentUserId();

  //   if (currentUserId === null) {
  //     console.log("user id in IF " + currentUserId);
  //     return [];
  //   }

  //   return this.items.filter(item => item.ownerIds.includes(this.getUserPartyId(currentUserId)));
  // }

  async getOwners(): Promise<Owner[]> {
    await this.loadInitialData();
    return this.owners;
  }

  async getUsers(): Promise<User[]> {
    await this.loadInitialData();
    return this.users;
  }

  // private getCurrentUserId(): Promise<number | null> {
  //   return new Promise((resolve) => {
  //     this.store
  //       .select(selectCurrentUserId)
  //       .pipe(take(1)) 
  //       .subscribe(userId => {
  //         resolve(userId);
  //       });
  //   });
  // }

  // private getUserPartyId(currentUserId: number): number {
  //   const user = this.users.find(u => u.id === currentUserId);
  //   console.log('users boolean ' + JSON.stringify(user?.partyId));
  //   return user ? user.partyId : 0;
  // }

  createProposal(itemId: number, ratios: { [key: number]: number }, comment: string): void {
    const currentUserId = this.store.select(selectCurrentUserId); 
    const proposal = {
      itemId,
      ratios,
      comment,
      createdAt: new Date(),
      createdBy: currentUserId, 
    };
    this.proposals.push(proposal);
    this.saveProposals();
  }

  private saveProposals(): void {
    localStorage.setItem('proposals', JSON.stringify(this.proposals));
  }
}
