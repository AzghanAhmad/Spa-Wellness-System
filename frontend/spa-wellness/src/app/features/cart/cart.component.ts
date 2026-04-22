import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartStoreService, CartLine } from '../../core/services/cart-store.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private readonly cartStore = inject(CartStoreService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  cart = this.cartStore.activeCart;

  totals = computed(() => {
    const lines = this.cart()?.lines ?? [];
    const net = lines.reduce((s, l) => s + l.netAmount, 0);
    const vat = lines.reduce((s, l) => s + l.vatAmt, 0);
    const gross = lines.reduce((s, l) => s + l.grossAmount, 0);
    const paid = lines.filter(l => l.paid).reduce((s, l) => s + l.grossAmount, 0);
    const due = gross - paid;
    return { net: +net.toFixed(2), vat: +vat.toFixed(2), gross: +gross.toFixed(2), paid: +paid.toFixed(2), due: +due.toFixed(2) };
  });

  updateDiscount(line: CartLine, pct: number): void {
    this.cartStore.updateLine(line.id, { discountPct: Math.max(0, Math.min(100, pct)) });
  }

  removeLine(id: string): void { this.cartStore.removeLine(id); }
  togglePaid(id: string): void { this.cartStore.togglePaid(id); }

  markAllPaid(): void {
    const lines = this.cart()?.lines ?? [];
    lines.forEach(l => { if (!l.paid) this.cartStore.togglePaid(l.id); });
    this.notification.success('Payment Recorded', 'All services marked as paid.');
  }

  postpone(): void {
    this.notification.success('Payment Postponed', 'Payment will be collected later.');
    this.cartStore.clearCart();
    this.router.navigate(['/bookings']);
  }

  goBack(): void { this.router.navigate(['/bookings']); }
}
