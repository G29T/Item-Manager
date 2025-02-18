import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
    constructor() {}

    loadFromLocalStorage<T>(key: string): T | null {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    saveToLocalStorage<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    clearFromLocalStorage(key: string): void {
        localStorage.removeItem(key);
    }
}
