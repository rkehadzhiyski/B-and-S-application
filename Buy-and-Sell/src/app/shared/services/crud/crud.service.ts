import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Item } from '../../models/item';

import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(private db: AngularFireDatabase) {}

  getAll(): Observable<Item[]> {
    return this.db.list('items').valueChanges() as Observable<Item[]>;
  }

  create(item: Item): void {
    const currentUserString = localStorage.getItem('user');
    if (!currentUserString) {
      throw new Error('User information not found in local storage.');
    }

    const currentUser = JSON.parse(currentUserString);
    if (!currentUser || !currentUser.uid) {
      throw new Error('Invalid user information in local storage.');
    }

    item.owner_id = currentUser.uid;

    const newItemRef = this.db.list('items').push(item);
    const newItemId = newItemRef.key;
    item.item_id = newItemId;

    this.db.object<Item>(`items/${newItemId}`).set(item);

    //TODO this might not work as intended! :D
    this.db.list(`users/${currentUser.uid}/listedItems`).push(newItemId);
  }

  updateItem(itemId: string, updatedData: any): Promise<void> {
    return this.db.object(`items/${itemId}`).update(updatedData);
  }

  deleteItem(itemId: string): Promise<void> {
    return this.db.object(`items/${itemId}`).remove();
  }

  getItemById(itemId: string): Observable<Item | null> {
    return this.db.object<Item>(`items/${itemId}`).valueChanges();
  }

  searchItemsByName(query: string): Observable<Item[]> {
    const queryRef = this.db.list<Item>('items', (ref) =>
      ref
        .orderByChild('item_name_lowercase')
        .startAt(query)
        .endAt(query + '\uf8ff')
    );
    
    return queryRef.valueChanges().pipe(
      catchError((error) => {
        console.error('Error fetching search results:', error);
        return of([]); 
      })
    );
  }
}
