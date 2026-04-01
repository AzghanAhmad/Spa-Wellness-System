import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Campaign, AudienceSegment, CampaignType } from '../../core/models';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-marketing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header"><h1 class="page-title">Marketing Automation</h1></div>

      <div class="card form-section">
        <div class="section-head"><h3>Create Campaign</h3></div>
        <div class="section-body">
          <div class="form-grid">
            <div class="form-group"><label>Campaign Name</label><input class="input" placeholder="Summer promo" [(ngModel)]="draft.name" /></div>
            <div class="form-group"><label>Type</label><select class="input" [(ngModel)]="draft.type"><option value="email">Email</option><option value="sms">SMS</option></select></div>
            <div class="form-group"><label>Audience</label><select class="input" [(ngModel)]="draft.audience"><option value="all">All</option><option value="new-customers">New</option><option value="returning">Returning</option><option value="vip-members">VIP</option><option value="inactive">Inactive</option></select></div>
            @if (draft.type === 'email') { <div class="form-group"><label>Subject</label><input class="input" placeholder="Subject line" [(ngModel)]="draft.subject" /></div> }
            <div class="form-group"><label>Scheduled</label><input class="input" type="datetime-local" [(ngModel)]="draft.scheduledDate" /></div>
          </div>
          <div class="form-group"><label>Content</label><textarea class="input" rows="4" placeholder="Campaign message..." [(ngModel)]="draft.content"></textarea></div>
          <button class="btn-primary" (click)="createCampaign()">Schedule Campaign</button>
        </div>
      </div>

      <div class="card table-section">
        <div class="section-head"><h3>Campaign Dashboard</h3><span class="count">{{ campaigns().length }}</span></div>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Audience</th><th>Open Rate</th><th>Click Rate</th></tr></thead>
            <tbody>@for (c of campaigns(); track c.id) {
              <tr><td class="cell-name">{{ c.name }}</td><td>{{ c.type }}</td><td><span class="badge-info">{{ c.status }}</span></td><td>{{ c.audienceCount }}</td><td>{{ c.stats.openRate }}%</td><td>{{ c.stats.clickRate }}%</td></tr>
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
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 14px; }
    .form-group { label { display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; } }
    textarea.input { resize: vertical; font-family: var(--font-sans); margin-bottom: 14px; }
    .cell-name { font-weight: 600; }
    @media (max-width: 960px) { .form-grid { grid-template-columns: 1fr; } }
    @media (max-width: 768px) { .page-wrapper { padding: 16px; } }
  `],
})
export class MarketingComponent implements OnInit {
  campaigns = signal<Campaign[]>([]);
  draft = { name: '', type: 'email' as CampaignType, subject: '', content: '', audience: 'all' as AudienceSegment, scheduledDate: '' };

  constructor(private readonly mockData: MockDataService, private readonly notification: NotificationService) {}
  ngOnInit(): void { this.mockData.getCampaigns().subscribe(c => this.campaigns.set(c)); }

  createCampaign(): void {
    if (!this.draft.name || !this.draft.content) { this.notification.warning('Missing', 'Provide name and content'); return; }
    const campaign: Campaign = {
      id: 'camp-' + Date.now(), name: this.draft.name, type: this.draft.type, status: 'scheduled',
      subject: this.draft.type === 'email' ? this.draft.subject : undefined, content: this.draft.content,
      audience: this.draft.audience, audienceCount: 120,
      scheduledDate: this.draft.scheduledDate || new Date().toISOString(),
      stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, unsubscribed: 0, openRate: 0, clickRate: 0 },
      createdAt: new Date().toISOString(),
    };
    this.campaigns.update(list => [campaign, ...list]);
    this.notification.success('Scheduled', `${campaign.name} queued`);
  }
}
