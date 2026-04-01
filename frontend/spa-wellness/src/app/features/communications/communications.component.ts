import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationSettings } from '../../core/models';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-communications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header"><h1 class="page-title">Automated Communications</h1></div>

      <div class="cards-grid">
        <div class="card settings-section">
          <div class="section-head"><h3>Notification Settings</h3></div>
          <div class="section-body">
            <div class="setting-row"><span>Email confirmations</span><span class="toggle" [class.active]="settings().emailConfirmations" (click)="toggle('emailConfirmations')"></span></div>
            <div class="setting-row"><span>SMS reminders</span><span class="toggle" [class.active]="settings().smsReminders" (click)="toggle('smsReminders')"></span></div>
            <div class="setting-row"><span>Follow-up after visit</span><span class="toggle" [class.active]="settings().followUpAfterVisit" (click)="toggle('followUpAfterVisit')"></span></div>
            <div class="setting-row"><span>Birthday greetings</span><span class="toggle" [class.active]="settings().birthdayGreetings" (click)="toggle('birthdayGreetings')"></span></div>
            <div class="setting-row"><span>Promotional emails</span><span class="toggle" [class.active]="settings().promotionalEmails" (click)="toggle('promotionalEmails')"></span></div>
            <div class="form-group" style="margin-top:16px"><label>Reminder lead time (hours)</label><input class="input" type="number" min="1" style="max-width:120px" [(ngModel)]="leadHours" /></div>
            <button class="btn-primary" style="margin-top:8px" (click)="save()">Save Settings</button>
          </div>
        </div>

        <div class="card preview-section">
          <div class="section-head"><h3>Message Preview</h3></div>
          <div class="section-body">
            <div class="preview-box">
              <p class="preview-subject"><strong>Subject:</strong> Booking Confirmation</p>
              <p class="preview-body">{{ previewMessage() }}</p>
            </div>
            <div class="preview-box" style="margin-top:12px">
              <p class="preview-subject"><strong>SMS Reminder</strong></p>
              <p class="preview-body">Hi Alex, reminder: your appointment is in {{ leadHours }} hours. See you at Serenity Spa!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-wrapper { padding: 24px 28px; max-width: 1200px; }
    .page-header { margin-bottom: 20px; }
    .page-title { font-size: 1.375rem; font-weight: 700; }
    .cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .settings-section, .preview-section { overflow: hidden; }
    .section-head { padding: 14px 20px; border-bottom: 1px solid var(--border-color); h3 { font-size: 0.9375rem; font-weight: 600; } }
    .section-body { padding: 20px; }
    .setting-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-color-light); font-size: 0.875rem; color: var(--text-primary); }
    .form-group { label { display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; } }
    .preview-box { background: var(--bg-hover); border-radius: var(--radius-md); padding: 16px; }
    .preview-subject { font-size: 0.8125rem; color: var(--text-primary); margin-bottom: 8px; }
    .preview-body { font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.6; }
    @media (max-width: 960px) { .cards-grid { grid-template-columns: 1fr; } }
    @media (max-width: 768px) { .page-wrapper { padding: 16px; } }
  `],
})
export class CommunicationsComponent implements OnInit {
  settings = signal<NotificationSettings>({ emailConfirmations: true, smsReminders: true, reminderHoursBefore: 24, followUpAfterVisit: true, birthdayGreetings: true, promotionalEmails: false });
  leadHours = 24;
  readonly previewMessage = computed(() => `Hi Alex, your booking is confirmed for tomorrow at 10:00 AM. We will send a reminder ${this.leadHours} hours before your appointment.`);

  constructor(private readonly mockData: MockDataService, private readonly notification: NotificationService) {}
  ngOnInit(): void { this.mockData.getNotificationSettings().subscribe(s => { this.settings.set(s); this.leadHours = s.reminderHoursBefore; }); }
  toggle(key: keyof Omit<NotificationSettings, 'reminderHoursBefore'>): void { this.settings.update(c => ({ ...c, [key]: !c[key] })); }
  save(): void { this.settings.update(c => ({ ...c, reminderHoursBefore: this.leadHours })); this.notification.success('Saved', 'Settings updated'); }
}
