import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ItemEffects } from '../store/item/item.effect';
import { itemReducer } from '../store/item/item.reducer'; 
import { userReducer } from '../store/user/user.reducer';
import { UserEffects } from '../store/user/user.effect';
import { proposalReducer } from '../store/proposal/proposal.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore({ 
      items: itemReducer, 
      user: userReducer,
      proposals: proposalReducer, 
    }),  
    provideEffects([ItemEffects]),
    provideEffects([UserEffects]),
    // provideStoreDevtools({ maxAge: 27, logOnly: !isDevMode() })
  ],
};
