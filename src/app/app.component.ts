import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './services/data.services';
import { ManagerContainerComponent } from './components/manager-container/manager-container.component';
import { Store } from '@ngrx/store';
import { loadUsers } from '../store/user/user.actions';
import { loadItems } from '../store/item/item.actions';
import { loadProposals } from '../store/proposal/proposal.actions';
import { loadOwners } from '../store/owner/owner.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    ManagerContainerComponent
  ],
  providers: [DataService],
})
export class AppComponent {

  constructor(private store: Store) {}

  ngOnInit(): void {
    // load the data as soon as the application initialises
    this.store.dispatch(loadUsers());
    this.store.dispatch(loadItems());
    this.store.dispatch(loadOwners());
    this.store.dispatch(loadProposals());
  }
}
