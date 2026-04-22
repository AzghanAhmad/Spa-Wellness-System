import { Injectable, signal } from '@angular/core';
import { Booking } from '../models';

@Injectable({ providedIn: 'root' })
export class BookingStoreService {
  private _bookings = signal<Booking[]>([]);
  private _initialized = false;

  readonly bookings = this._bookings.asReadonly();

  init(bookings: Booking[]): void {
    if (!this._initialized) {
      this._bookings.set(bookings);
      this._initialized = true;
    }
  }

  add(booking: Booking): void {
    this._bookings.update(list => [...list, booking]);
  }

  update(id: string, changes: Partial<Booking>): void {
    this._bookings.update(list => list.map(b => b.id === id ? { ...b, ...changes } as Booking : b));
  }

  remove(id: string): void {
    this._bookings.update(list => list.filter(b => b.id !== id));
  }

  getAll(): Booking[] { return this._bookings(); }
}
