import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Payment, PaymentMethod, PaymentType } from '../../core/models';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div><h1 class="page-title">Payments & Transactions</h1><p class="page-subtitle">Take deposits/full payments and manage billing.</p></div>
      </div>

      <section class="card panel form-panel">
        <h3>Record Payment</h3>
        <div class="grid">
          <input class="input" placeholder="Customer name" [(ngModel)]="form.customerName" />
          <select class="input" [(ngModel)]="form.type">
            <option value="deposit">Deposit</option><option value="full">Full payment</option><option value="split">Split billing</option>
          </select>
          <select class="input" [(ngModel)]="form.method">
            <option value="card">Card</option><option value="cash">Cash</option><option value="online">Online</option>
          </select>
          <input class="input" type="number" min="0" step="0.01" placeholder="Amount" [(ngModel)]="form.amount" />
          <input class="input" type="number" min="0" placeholder="Discount" [(ngModel)]="form.discount" />
          <select class="input" [(ngModel)]="form.discountType">
            <option value="percentage">% discount</option><option value="fixed">Fixed discount</option>
          </select>
          <label class="checkbox"><input type="checkbox" [(ngModel)]="form.groupBilling" /> Group billing</label>
        </div>
        <div class="totals">
          <span>Tax: {{ '$' + tax().toFixed(2) }}</span>
          <strong>Total: {{ '$' + total().toFixed(2) }}</strong>
        </div>
        <button class="btn-primary" (click)="recordPayment()">Save Payment</button>
      </section>

      <section class="card panel">
        <h3>Transactions</h3>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Customer</th><th>Type</th><th>Method</th><th>Status</th><th>Total</th><th>Paid At</th></tr></thead>
            <tbody>
              @for (payment of payments(); track payment.id) {
                <tr>
                  <td>{{ payment.customerName }}</td>
                  <td>{{ payment.type }}</td>
                  <td>{{ payment.method }}</td>
                  <td><span class="badge-success">{{ payment.status }}</span></td>
                  <td>{{ '$' + payment.totalAmount.toFixed(2) }}</td>
                  <td>{{ payment.paidAt }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page { display: grid; gap: 20px; }
    .page-title { font-size: 1.5rem; font-weight: 700; }
    .page-subtitle { color: var(--text-secondary); }
    .panel { padding: 20px; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 12px; }
    .checkbox { display: flex; gap: 8px; align-items: center; color: var(--text-secondary); }
    .totals { display: flex; justify-content: space-between; margin: 12px 0; }
    @media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }
  `],
})
export class PaymentsComponent implements OnInit {
  payments = signal<Payment[]>([]);
  form = {
    customerName: '',
    amount: 120,
    type: 'full' as PaymentType,
    method: 'card' as PaymentMethod,
    discount: 0,
    discountType: 'percentage' as 'percentage' | 'fixed',
    groupBilling: false,
  };

  readonly tax = computed(() => Math.max(0, this.baseAfterDiscount() * 0.08));
  readonly total = computed(() => this.baseAfterDiscount() + this.tax());

  constructor(
    private readonly mockData: MockDataService,
    private readonly notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.mockData.getPayments().subscribe((payments) => this.payments.set(payments));
  }

  private baseAfterDiscount(): number {
    const amount = this.form.amount || 0;
    if (!this.form.discount) return amount;
    return this.form.discountType === 'percentage'
      ? amount - amount * (this.form.discount / 100)
      : amount - this.form.discount;
  }

  recordPayment(): void {
    if (!this.form.customerName || this.form.amount <= 0) {
      this.notification.warning('Invalid payment', 'Enter customer name and amount.');
      return;
    }

    const payment: Payment = {
      id: 'p-' + Date.now(),
      bookingId: 'manual',
      customerId: 'manual',
      customerName: this.form.customerName,
      amount: this.form.amount,
      method: this.form.method,
      status: 'completed',
      type: this.form.groupBilling ? 'split' : this.form.type,
      discount: this.form.discount || undefined,
      discountType: this.form.discount ? this.form.discountType : undefined,
      tax: Number(this.tax().toFixed(2)),
      totalAmount: Number(this.total().toFixed(2)),
      paidAt: new Date().toISOString(),
    };
    this.payments.update((list) => [payment, ...list]);
    this.notification.success('Payment recorded', 'Transaction has been added.');
  }
}
