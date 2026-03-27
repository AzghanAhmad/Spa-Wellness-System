import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GiftVoucher, SpaService } from '../../core/models';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-vouchers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Gift Vouchers</h1>
          <p class="page-subtitle">Create and manage digital vouchers</p>
        </div>
      </div>

      <div class="grid">
        <section class="card panel">
          <h3>Create Voucher</h3>
          <div class="form-grid">
            <label>Type</label>
            <select class="input" [(ngModel)]="draft.type">
              <option value="monetary">Monetary</option>
              <option value="package">Package</option>
            </select>

            @if (draft.type === 'monetary') {
              <label>Amount</label>
              <input class="input" type="number" [(ngModel)]="draft.amount" min="25" step="5" />
            } @else {
              <label>Package</label>
              <select class="input" [(ngModel)]="draft.packageId">
                <option value="">Select a package</option>
                @for (service of packageServices(); track service.id) {
                  <option [value]="service.id">{{ service.name }} ({{ '$' + service.price }})</option>
                }
              </select>
            }

            <label>Recipient Name</label>
            <input class="input" [(ngModel)]="draft.recipientName" />
            <label>Recipient Email</label>
            <input class="input" type="email" [(ngModel)]="draft.recipientEmail" />
            <label>Sender Name</label>
            <input class="input" [(ngModel)]="draft.senderName" />
            <label>Sender Email</label>
            <input class="input" type="email" [(ngModel)]="draft.senderEmail" />
            <label>Message</label>
            <textarea class="input" rows="3" [(ngModel)]="draft.message"></textarea>
          </div>
          <div class="actions">
            <button class="btn-primary" (click)="createVoucher()">Generate Voucher</button>
            <button class="btn-secondary" (click)="downloadPreview()">Download / Print</button>
          </div>
        </section>

        <section class="card panel preview">
          <h3>Digital Voucher Preview</h3>
          <div class="voucher-preview">
            <div class="voucher-brand">Serenity Spa</div>
            <div class="voucher-title">Gift Voucher</div>
            <div class="voucher-value">
              @if (draft.type === 'monetary') { {{ '$' + (draft.amount || 0) }} } @else { Package Voucher }
            </div>
            <div class="voucher-meta">
              <p>To: {{ draft.recipientName || 'Recipient' }}</p>
              <p>From: {{ draft.senderName || 'Sender' }}</p>
              <p>{{ draft.message || 'A relaxing treat from Serenity Spa.' }}</p>
            </div>
          </div>
        </section>
      </div>

      <section class="card panel">
        <h3>Issued Vouchers</h3>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr><th>Code</th><th>Recipient</th><th>Type</th><th>Value</th><th>Status</th><th>Expiry</th></tr>
            </thead>
            <tbody>
              @for (voucher of vouchers(); track voucher.id) {
                <tr>
                  <td><strong>{{ voucher.code }}</strong></td>
                  <td>{{ voucher.recipientName }}</td>
                  <td>{{ voucher.type }}</td>
                  <td>{{ voucher.amount ? ('$' + voucher.amount) : voucher.packageName }}</td>
                  <td><span class="badge-primary">{{ voucher.status }}</span></td>
                  <td>{{ voucher.expiryDate }}</td>
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
    .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
    .panel { padding: 20px; }
    .form-grid { display: grid; grid-template-columns: 1fr; gap: 8px; margin-top: 12px; }
    .form-grid label { font-size: .85rem; color: var(--text-secondary); }
    .actions { display: flex; gap: 12px; margin-top: 14px; flex-wrap: wrap; }
    .voucher-preview { border: 1px dashed var(--color-primary); border-radius: 14px; padding: 18px; background: var(--color-primary-50); }
    .voucher-brand { font-weight: 700; color: var(--color-primary-dark); }
    .voucher-title { font-size: 1.3rem; font-weight: 700; margin-top: 8px; }
    .voucher-value { font-size: 1.8rem; font-weight: 800; margin: 10px 0; }
    .voucher-meta { color: var(--text-secondary); display: grid; gap: 4px; }
    @media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }
  `],
})
export class VouchersComponent implements OnInit {
  vouchers = signal<GiftVoucher[]>([]);
  services = signal<SpaService[]>([]);
  draft = {
    type: 'monetary' as 'monetary' | 'package',
    amount: 100,
    packageId: '',
    recipientName: '',
    recipientEmail: '',
    senderName: '',
    senderEmail: '',
    message: '',
  };

  readonly packageServices = computed(() =>
    this.services().filter((service) => service.category === 'package'),
  );

  constructor(
    private readonly mockData: MockDataService,
    private readonly notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.mockData.getVouchers().subscribe((vouchers) => this.vouchers.set(vouchers));
    this.mockData.getServices().subscribe((services) => this.services.set(services));
  }

  createVoucher(): void {
    if (!this.draft.recipientName || !this.draft.recipientEmail || !this.draft.senderName) {
      this.notification.warning('Incomplete details', 'Please complete recipient and sender details.');
      return;
    }

    const packageService = this.services().find((service) => service.id === this.draft.packageId);
    const voucher: GiftVoucher = {
      id: 'v-' + Date.now(),
      code: 'GIFT-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      type: this.draft.type,
      amount: this.draft.type === 'monetary' ? this.draft.amount : undefined,
      packageId: this.draft.type === 'package' ? this.draft.packageId : undefined,
      packageName: this.draft.type === 'package' ? packageService?.name : undefined,
      recipientName: this.draft.recipientName,
      recipientEmail: this.draft.recipientEmail,
      senderName: this.draft.senderName,
      senderEmail: this.draft.senderEmail,
      message: this.draft.message,
      status: 'active',
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    this.vouchers.update((list) => [voucher, ...list]);
    this.notification.success('Voucher created', `Code ${voucher.code} is ready.`);
  }

  downloadPreview(): void {
    this.notification.info('Preview exported', 'Download/print simulation complete.');
  }
}
