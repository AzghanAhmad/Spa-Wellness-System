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
    <div class="page-wrapper">
      <div class="page-header"><h1 class="page-title">Gift Vouchers</h1></div>

      <div class="layout-grid">
        <section class="card form-panel">
          <div class="panel-head"><h3>Create Voucher</h3></div>
          <div class="panel-body">
            <div class="form-group"><label>Type</label><select class="input" [(ngModel)]="draft.type"><option value="monetary">Monetary</option><option value="package">Package</option></select></div>
            @if (draft.type === 'monetary') {
              <div class="form-group"><label>Amount</label><input class="input" type="number" [(ngModel)]="draft.amount" min="25" step="5" /></div>
            } @else {
              <div class="form-group"><label>Package</label><select class="input" [(ngModel)]="draft.packageId"><option value="">Select a package</option>@for (s of packageServices(); track s.id) { <option [value]="s.id">{{ s.name }} ({{ '$' + s.price }})</option> }</select></div>
            }
            <div class="form-row"><div class="form-group"><label>Recipient Name</label><input class="input" [(ngModel)]="draft.recipientName" /></div><div class="form-group"><label>Recipient Email</label><input class="input" type="email" [(ngModel)]="draft.recipientEmail" /></div></div>
            <div class="form-row"><div class="form-group"><label>Sender Name</label><input class="input" [(ngModel)]="draft.senderName" /></div><div class="form-group"><label>Sender Email</label><input class="input" type="email" [(ngModel)]="draft.senderEmail" /></div></div>
            <div class="form-group"><label>Message</label><textarea class="input" rows="3" [(ngModel)]="draft.message"></textarea></div>
            <div class="form-actions"><button class="btn-primary" (click)="createVoucher()">Generate Voucher</button><button class="btn-secondary" (click)="downloadPreview()">Download / Print</button></div>
          </div>
        </section>

        <section class="card preview-panel">
          <div class="panel-head"><h3>Preview</h3></div>
          <div class="voucher-card">
            <div class="v-brand">Serenity Spa</div>
            <div class="v-title">Gift Voucher</div>
            <div class="v-amount">@if (draft.type === 'monetary') { {{ '$' + (draft.amount || 0) }} } @else { Package }</div>
            <div class="v-details">
              <p>To: {{ draft.recipientName || 'Recipient' }}</p>
              <p>From: {{ draft.senderName || 'Sender' }}</p>
              <p class="v-msg">{{ draft.message || 'Enjoy a relaxing experience at Serenity Spa.' }}</p>
            </div>
          </div>
        </section>
      </div>

      <div class="card table-section">
        <div class="section-head"><h3>Issued Vouchers</h3><span class="count">{{ vouchers().length }}</span></div>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Code</th><th>Recipient</th><th>Type</th><th>Value</th><th>Status</th><th>Expiry</th></tr></thead>
            <tbody>@for (v of vouchers(); track v.id) {
              <tr>
                <td><strong>{{ v.code }}</strong></td><td>{{ v.recipientName }}</td><td>{{ v.type }}</td>
                <td>{{ v.amount ? ('$' + v.amount) : v.packageName }}</td>
                <td><span class="badge-primary">{{ v.status }}</span></td><td>{{ v.expiryDate }}</td>
              </tr>
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
    .layout-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; margin-bottom: 20px; }
    .form-panel, .preview-panel { overflow: hidden; }
    .panel-head { padding: 14px 20px; border-bottom: 1px solid var(--border-color); h3 { font-size: 0.9375rem; font-weight: 600; } }
    .panel-body { padding: 20px; }
    .form-group { margin-bottom: 14px; label { display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; } }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    textarea.input { resize: vertical; font-family: var(--font-sans); }
    .form-actions { display: flex; gap: 8px; margin-top: 6px; }

    .voucher-card { margin: 20px; padding: 24px; border: 1px dashed var(--color-primary); border-radius: var(--radius-lg); background: var(--color-primary-50); }
    .v-brand { font-weight: 700; color: var(--color-primary-dark); font-size: 0.8125rem; }
    .v-title { font-size: 1.25rem; font-weight: 700; margin-top: 6px; }
    .v-amount { font-size: 2rem; font-weight: 800; margin: 8px 0; color: var(--color-primary-dark); }
    .v-details { color: var(--text-secondary); font-size: 0.8125rem; display: grid; gap: 3px; }
    .v-msg { font-style: italic; margin-top: 6px; }

    .table-section { overflow: hidden; }
    .section-head { display: flex; align-items: center; gap: 8px; padding: 14px 20px; border-bottom: 1px solid var(--border-color); h3 { font-size: 0.9375rem; font-weight: 600; } }
    .count { font-size: 0.6875rem; padding: 2px 8px; background: var(--color-primary-50); color: var(--color-primary-dark); border-radius: var(--radius-full); font-weight: 600; }
    @media (max-width: 960px) { .layout-grid { grid-template-columns: 1fr; } }
    @media (max-width: 768px) { .page-wrapper { padding: 16px; } .form-row { grid-template-columns: 1fr; } }
  `],
})
export class VouchersComponent implements OnInit {
  vouchers = signal<GiftVoucher[]>([]);
  services = signal<SpaService[]>([]);
  draft = { type: 'monetary' as 'monetary' | 'package', amount: 100, packageId: '', recipientName: '', recipientEmail: '', senderName: '', senderEmail: '', message: '' };
  readonly packageServices = computed(() => this.services().filter(s => s.category === 'package'));

  constructor(private readonly mockData: MockDataService, private readonly notification: NotificationService) {}

  ngOnInit(): void {
    this.mockData.getVouchers().subscribe(v => this.vouchers.set(v));
    this.mockData.getServices().subscribe(s => this.services.set(s));
  }

  createVoucher(): void {
    if (!this.draft.recipientName || !this.draft.recipientEmail || !this.draft.senderName) { this.notification.warning('Incomplete', 'Fill all fields'); return; }
    const pkg = this.services().find(s => s.id === this.draft.packageId);
    const voucher: GiftVoucher = {
      id: 'v-' + Date.now(), code: 'GIFT-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      type: this.draft.type, amount: this.draft.type === 'monetary' ? this.draft.amount : undefined,
      packageId: this.draft.type === 'package' ? this.draft.packageId : undefined, packageName: this.draft.type === 'package' ? pkg?.name : undefined,
      recipientName: this.draft.recipientName, recipientEmail: this.draft.recipientEmail, senderName: this.draft.senderName, senderEmail: this.draft.senderEmail,
      message: this.draft.message, status: 'active', expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0], createdAt: new Date().toISOString(),
    };
    this.vouchers.update(list => [voucher, ...list]);
    this.notification.success('Created', `Code ${voucher.code} ready`);
  }

  downloadPreview(): void { this.notification.info('Exported', 'Print simulation done'); }
}
