import { Injectable, signal } from '@angular/core';
import { Booking } from '../models';
import { MockDataService } from './mock-data.service';

@Injectable({ providedIn: 'root' })
export class BookingStateService {
  readonly bookings = signal<Booking[]>([]);
  readonly isLoaded = signal(false);

  constructor(private readonly mockData: MockDataService) {}

  loadInitialBookings(): void {
    if (this.isLoaded()) {
      return;
    }

    this.mockData.getBookings().subscribe((bookings) => {
      this.bookings.set(bookings);
      this.isLoaded.set(true);
    });
  }

  addBooking(booking: Booking): void {
    this.bookings.update((list) => [booking, ...list]);
  }

  updateBookingStatus(id: string, status: Booking['status']): void {
    this.bookings.update((list) =>
      list.map((booking) =>
        booking.id === id ? { ...booking, status, updatedAt: new Date().toISOString() } : booking,
      ),
    );
  }
}
