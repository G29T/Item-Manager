import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserSwitchComponent } from './components/user-switch/user-switch.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { DataService } from './services/data.services';
// import { ProposalFormComponent } from './components/proposal-dialog/proposal-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProposalHistoryComponent } from './components/proposal-history/proposal-history.component';
import { CounterProposalDialogComponent } from './components/counterproposal-dialog/counterproposal-dialog.component';
import { ItemsContainer } from './components/items-container/items-container.component';
import { ProposalDialogComponent } from './components/proposal-dialog/proposal-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    CommonModule,
    RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    UserSwitchComponent,
    ItemListComponent, 
    ProposalHistoryComponent,
    ProposalDialogComponent,
    CounterProposalDialogComponent,
    ItemsContainer
  ],
  providers: [DataService],
})
export class AppComponent {
  title = 'item-manager';

  ngOnInit(): void {
    
  }
}
