import { Injectable } from '@angular/core';
import { Item } from '../models/items.model';
import { Owner } from '../models/owner.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private currentUserId: number | null = null;
  private items: Item[] = [];
  private owners: Owner[] = [];
  private users: User[] = [];
  private proposals: any[] = [];

  constructor() {
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    try {
      this.items = await this.loadJSON<Item[]>('assets/items.json');
      this.owners = await this.loadJSON<Owner[]>('assets/owners.json');
      this.users = await this.loadJSON<User[]>('assets/users.json');
      // console.log('Users loaded:', this.users); 
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
    // return this.items.filter(item => {
    //     if (this.currentUserId) {
    //         return item.ownerIds.includes(this.getUserPartyId());
    //     }
    //         return false;
    //     }
    // );
    if (this.currentUserId === null) {
      return [];
    }
    
    return this.items.filter(item => {
      return item.ownerIds.includes(this.getUserPartyId());
    });          
  }

  async getOwners(): Promise<Owner[]> {
    await this.loadInitialData(); 
    return this.owners;
  }

  async getUsers(): Promise<User[]> {
    await this.loadInitialData();
    return this.users;
  }

  setCurrentUser(userId: number): void {
    this.currentUserId = userId;
  }

  getUserPartyId(): number {
    const user = this.users.find(u => u.id === this.currentUserId);
    return user ? user.partyId : 0;
  }

  createProposal(itemId: number, ratios: { [key: number]: number }, comment: string): void {
    const proposal = {
      itemId,
      ratios,
      comment,
      createdAt: new Date(),
      createdBy: this.currentUserId,
    };
    this.proposals.push(proposal);
    this.saveProposals();
  }

  private saveProposals(): void {
    localStorage.setItem('proposals', JSON.stringify(this.proposals));
  }
}
