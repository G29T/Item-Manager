import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators'; 
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

  async getItemsByUser(): Promise<Item[]> {
    await this.loadInitialData();

    const currentUserId = await this.getCurrentUserId();

    if (currentUserId === null) { 
      return [];
    }

    return this.items.filter(item => item.ownerIds.includes(this.getUserPartyId(currentUserId)));
  }

  async getOwners(): Promise<Owner[]> {
    await this.loadInitialData();
    return this.owners;
  }

  async getUsers(): Promise<User[]> {
    await this.loadInitialData();
    return this.users;
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

  private getUserPartyId(currentUserId: number): number {
    const user = this.users.find(u => u.id === currentUserId);
    console.log('users boolean ' + JSON.stringify(user?.partyId));
    return user ? user.partyId : 0;
  }

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
