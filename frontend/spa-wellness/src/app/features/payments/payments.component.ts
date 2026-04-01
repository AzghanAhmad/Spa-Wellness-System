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
    <div class="page-wrapper">
      <div class="page-header"><h1 class="page-title">Payments & Transactions</h1></div>

      <div class="card form-section">
        <div class="section-head"><h3>Record Payment</h3></div>
        <div class="section-body">
          <div class="form-grid">
            <div class="form-group"><label>Customer</label><input class="input" placeholder="Customer name" [(ngModel)]="form.customerName" /></div>
            <div class="form-group"><label>Type</label><select class="input" [(ngModel)]="form.type"><option value="deposit">Deposit</option><option value="full">Full</option><option value="split">Split</option></select></div>
            <div class="form-group"><label>Method</label><select class="input" [(ngModel)]="form.method"><option value="card">Card</option><option value="cash">Cash</option><option value="online">Online</option></select></div>
            <div class="form-group"><label>Amount</label><input class="input" type="number" min="0" step="0.01" [(ngModel)]="form.amount" /></div>
            <div class="form-group"><label>Discount</label><input class="input" type="number" min="0" [(ngModel)]="form.discount" /></div>
            <div class="form-group"><label>Discount Type</label><select class="input" [(ngModel)]="form.discountType"><option value="percentage">%</option><option value="fixed">Fixed</option></select></div>
          </div>
          <div class="totals-row">
            <label class="cb-label"><input type="checkbox" [(ngModel)]="form.groupBilling" /> Group billing</label>
            <div class="totals-right">
              <span class="tax-val">Tax: {{ '$' + tax().toFixed(2) }}</span>
              <strong class="total-val">Total: {{ '$' + total().toFixed(2) }}</strong>
              <button class="btn-primary" (click)="recordPayment()">Save Payment</button>
            </div>
          </div>
        </div>
      </div>

      <div class="card table-section">
        <div class="section-head"><h3>Transactions</h3><span class="count">{{ payments().length }}</span></div>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Customer</th><th>Type</th><th>Method</th><th>Status</th><th>Total</th><th>Paid At</th></tr></thead>
            <tbody>@for (p of payments(); track p.id) {
              <tr><td class="cell-name">{{ p.customerName }}</td><td>{{ p.type }}</td><td>{{ p.method }}</td><td><span class="badge-success">{{ p.status }}</span></td><td class="amount-cell">{{ '$' + p.totalAmount.toFixed(2) }}</td><td>{{ p.paidAt }}</td></tr>
            }</tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-wrapper { padding: 24px 28px; max-width: 1400px; }
    .page-header { margin-bottom: 20px; }
    .page-title { font-size: 1.375rem; font-weight: 700; }
    .form-section, .table-section { overflow: hidden; margin-bottom: 16px; }
    .section-head { display: flex; align-items: center; gap: 8px; padding: 14px 20px; border-bottom: 1px solid var(--border-color); h3 { font-size: 0.9375rem; font-weight: 600; } }
    .count { font-size: 0.6875rem; padding: 2px 8px; background: var(--color-primary-50); color: var(--color-primary-dark); border-radius: var(--radius-full); font-weight: 600; }
    .section-body { padding: 20px; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .form-group { label { display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; } }
    .totals-row { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; flex-wrap: wrap; gap: 12px; }
    .cb-label { display: flex; align-items: center; gap: 6px; font-size: 0.8125rem; color: var(--text-secondary); cursor: pointer; input { accent-color: var(--color-primary); } }
    .totals-right { display: flex; align-items: center; gap: 16px; }
    .tax-val { font-size: 0.8125rem; color: var(--text-secondary); }
    .total-val { font-size: 1rem; color: var(--text-primary); }
    .cell-name { font-weight: 600; }
    .amount-cell { font-weight: 700; font-variant-numeric: tabular-nums; }
    @media (max-width: 960px) { .form-grid { grid-template-columns: 1fr; } }
    @media (max-width: 768px) { .page-wrapper { padding: 16px; } }
  `],
})
export class PaymentsComponent implements OnInit {
  payments = signal<Payment[]>([]);
  form = { customerName: '', amount: 120, type: 'full' as PaymentType, method: 'card' as PaymentMethod, discount: 0, discountType: 'percentage' as 'percentage' | 'fixed', groupBilling: false };

  readonly tax = computed(() => Math.max(0, this.baseAfterDiscount() * 0.08));
  readonly total = computed(() => this.baseAfterDiscount() + this.tax());

  constructor(private readonly mockData: MockDataService, private readonly notification: NotificationService) {}
  ngOnInit(): void { this.mockData.getPayments().subscribe(p => this.payments.set(p)); }

  private baseAfterDiscount(): number {
    const a = this.form.amount || 0;
    if (!this.form.discount) return a;
    return this.form.discountType === 'percentage' ? a - a * (this.form.discount / 100) : a - this.form.discount;
  }

  recordPayment(): void {
    if (!this.form.customerName || this.form.amount <= 0) { this.notification.warning('Invalid', 'Enter name and amount'); return; }
    const payment: Payment = {
      id: 'p-' + Date.now(), bookingId: 'manual', customerId: 'manual', customerName: this.form.customerName,
      amount: this.form.amount, method: this.form.method, status: 'completed',
      type: this.form.groupBilling ? 'split' : this.form.type,
      discount: this.form.discount || undefined, discountType: this.form.discount ? this.form.discountType : undefined,
      tax: Number(this.tax().toFixed(2)), totalAmount: Number(this.total().toFixed(2)), paidAt: new Date().toISOString(),
    };
    this.payments.update(list => [payment, ...list]);
    this.notification.success('Recorded', 'Transaction added');
  }
}
