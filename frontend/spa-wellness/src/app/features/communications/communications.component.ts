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
    <div class="page">
      <div class="page-header">
        <div><h1 class="page-title">Automated Communications</h1><p class="page-subtitle">Configure reminders and preview outbound messages.</p></div>
      </div>

      <section class="card panel">
        <h3>Notification Settings</h3>
        <div class="setting-row"><span>Email confirmations</span><span class="toggle" [class.active]="settings().emailConfirmations" (click)="toggle('emailConfirmations')"></span></div>
        <div class="setting-row"><span>SMS reminders</span><span class="toggle" [class.active]="settings().smsReminders" (click)="toggle('smsReminders')"></span></div>
        <div class="setting-row"><span>Follow-up after visit</span><span class="toggle" [class.active]="settings().followUpAfterVisit" (click)="toggle('followUpAfterVisit')"></span></div>
        <div class="setting-row"><span>Birthday greetings</span><span class="toggle" [class.active]="settings().birthdayGreetings" (click)="toggle('birthdayGreetings')"></span></div>
        <div class="setting-row"><span>Promotional emails</span><span class="toggle" [class.active]="settings().promotionalEmails" (click)="toggle('promotionalEmails')"></span></div>
        <label>Reminder lead time (hours)</label>
        <input class="input" type="number" min="1" [(ngModel)]="leadHours" />
        <button class="btn-primary" (click)="save()">Save Settings</button>
      </section>

      <section class="card panel">
        <h3>Message Preview</h3>
        <div class="preview">
          <p><strong>Subject:</strong> Booking Confirmation</p>
          <p>{{ previewMessage() }}</p>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page { display: grid; gap: 20px; }
    .page-title { font-size: 1.5rem; font-weight: 700; }
    .page-subtitle { color: var(--text-secondary); }
    .panel { padding: 20px; display: grid; gap: 12px; }
    .setting-row { display: flex; align-items: center; justify-content: space-between; }
    .preview { background: var(--bg-tertiary); border-radius: 12px; padding: 14px; color: var(--text-secondary); }
  `],
})
export class CommunicationsComponent implements OnInit {
  settings = signal<NotificationSettings>({
    emailConfirmations: true,
    smsReminders: true,
    reminderHoursBefore: 24,
    followUpAfterVisit: true,
    birthdayGreetings: true,
    promotionalEmails: false,
  });
  leadHours = 24;

  readonly previewMessage = computed(
    () =>
      `Hi Alex, your booking is confirmed for tomorrow at 10:00 AM. We will send a reminder ${this.leadHours} hours before your appointment.`,
  );

  constructor(
    private readonly mockData: MockDataService,
    private readonly notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.mockData.getNotificationSettings().subscribe((settings) => {
      this.settings.set(settings);
      this.leadHours = settings.reminderHoursBefore;
    });
  }

  toggle(key: keyof Omit<NotificationSettings, 'reminderHoursBefore'>): void {
    this.settings.update((current) => ({ ...current, [key]: !current[key] }));
  }

  save(): void {
    this.settings.update((current) => ({ ...current, reminderHoursBefore: this.leadHours }));
    this.notification.success('Settings saved', 'Automated communication settings updated.');
  }
}
