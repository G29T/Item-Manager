import { Component } from '@angular/core';
import { DataService } from '../../services/data.services';
import { User } from '../../models/user.model';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Item } from '../../models/items.model';

@Component({
    selector: 'user-switch',
    templateUrl: './user-switch.component.html',
    styleUrls: ['./user-switch.component.css'],
    imports: [CommonModule, FormsModule,MatSelectModule, MatOptionModule]
})
export class UserSwitchComponent {
    users: User[] = [];
    selectedUserId: number | null = null;
    items: Item[] = [];

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.loadUsers();
    }

    private async loadUsers(): Promise<void> {
        try {
            this.users = await this.dataService.getUsers();
            console.log('Users in UserSwitchComponent:', this.users); 
        } catch (error) {
            console.error('Error fetching users:', error); 
        }
    }

    switchUser(userId: number): void {
        this.selectedUserId = userId;
        this.dataService.setCurrentUser(userId);
        this.loadItems(); 
    }
    
    private async loadItems(): Promise<void> {
        try {
            this.items = await this.dataService.getItems(); 
            console.log('Loaded items:', this.items); 
        } catch (error) {
            console.error('Error fetching items:', error); 
        }
    }
  
}
