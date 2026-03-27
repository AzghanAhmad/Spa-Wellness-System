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
    <div class="page">
      <div class="page-header">
        <div><h1 class="page-title">Marketing Automation</h1><p class="page-subtitle">Create and schedule SMS/email campaigns.</p></div>
      </div>

      <section class="card panel">
        <h3>Create Campaign</h3>
        <div class="grid">
          <input class="input" placeholder="Campaign name" [(ngModel)]="draft.name" />
          <select class="input" [(ngModel)]="draft.type">
            <option value="email">Email</option><option value="sms">SMS</option>
          </select>
          <select class="input" [(ngModel)]="draft.audience">
            <option value="all">All customers</option><option value="new-customers">New customers</option>
            <option value="returning">Returning</option><option value="vip-members">VIP members</option>
            <option value="inactive">Inactive</option>
          </select>
          @if (draft.type === 'email') { <input class="input" placeholder="Subject" [(ngModel)]="draft.subject" /> }
          <input class="input" type="datetime-local" [(ngModel)]="draft.scheduledDate" />
        </div>
        <textarea class="input content" rows="4" placeholder="Campaign message..." [(ngModel)]="draft.content"></textarea>
        <button class="btn-primary" (click)="createCampaign()">Schedule Campaign</button>
      </section>

      <section class="card panel">
        <h3>Campaign Dashboard</h3>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Audience</th><th>Open Rate</th><th>Click Rate</th></tr></thead>
            <tbody>
              @for (campaign of campaigns(); track campaign.id) {
                <tr>
                  <td>{{ campaign.name }}</td>
                  <td>{{ campaign.type }}</td>
                  <td><span class="badge-info">{{ campaign.status }}</span></td>
                  <td>{{ campaign.audienceCount }}</td>
                  <td>{{ campaign.stats.openRate }}%</td>
                  <td>{{ campaign.stats.clickRate }}%</td>
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
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 12px 0; }
    .content { margin-bottom: 12px; }
    @media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }
  `],
})
export class MarketingComponent implements OnInit {
  campaigns = signal<Campaign[]>([]);
  draft = {
    name: '',
    type: 'email' as CampaignType,
    subject: '',
    content: '',
    audience: 'all' as AudienceSegment,
    scheduledDate: '',
  };

  constructor(
    private readonly mockData: MockDataService,
    private readonly notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.mockData.getCampaigns().subscribe((campaigns) => this.campaigns.set(campaigns));
  }

  createCampaign(): void {
    if (!this.draft.name || !this.draft.content) {
      this.notification.warning('Missing campaign details', 'Please provide campaign name and content.');
      return;
    }

    const campaign: Campaign = {
      id: 'camp-' + Date.now(),
      name: this.draft.name,
      type: this.draft.type,
      status: 'scheduled',
      subject: this.draft.type === 'email' ? this.draft.subject : undefined,
      content: this.draft.content,
      audience: this.draft.audience,
      audienceCount: 120,
      scheduledDate: this.draft.scheduledDate || new Date().toISOString(),
      stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, unsubscribed: 0, openRate: 0, clickRate: 0 },
      createdAt: new Date().toISOString(),
    };
    this.campaigns.update((list) => [campaign, ...list]);
    this.notification.success('Campaign scheduled', `${campaign.name} is queued.`);
  }
}
