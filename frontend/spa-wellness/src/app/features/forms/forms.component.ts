import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConsultationForm, FormFieldType, FormResponse } from '../../core/models';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div><h1 class="page-title">Consultation & Medical Forms</h1><p class="page-subtitle">Build forms and monitor restrictions.</p></div>
      </div>

      <section class="card panel">
        <h3>Dynamic Form Builder</h3>
        <div class="grid">
          <input class="input" placeholder="Field label" [(ngModel)]="newField.label" />
          <select class="input" [(ngModel)]="newField.type">
            <option value="text">Text</option><option value="textarea">Textarea</option>
            <option value="select">Select</option><option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option><option value="number">Number</option>
          </select>
          <label class="checkbox"><input type="checkbox" [(ngModel)]="newField.required" /> Required</label>
        </div>
        <button class="btn-secondary" (click)="addField()">Add Field</button>
        <ul class="field-list">
          @for (field of draftFields(); track field.id) {
            <li>{{ field.label }} <span class="badge-primary">{{ field.type }}</span></li>
          }
        </ul>
      </section>

      <section class="card panel">
        <h3>Responses & Restrictions</h3>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Customer</th><th>Form</th><th>Submitted</th><th>Restrictions</th></tr></thead>
            <tbody>
              @for (response of responses(); track response.id) {
                <tr>
                  <td>{{ response.customerName }}</td>
                  <td>{{ getFormTitle(response.formId) }}</td>
                  <td>{{ response.submittedAt }}</td>
                  <td>
                    @if (response.restrictions.length === 0) {
                      <span class="badge-success">No restrictions</span>
                    } @else {
                      <span class="badge-danger">{{ response.restrictions.join(', ') }}</span>
                    }
                  </td>
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
    .checkbox { display: flex; gap: 8px; align-items: center; color: var(--text-secondary); }
    .field-list { margin-top: 12px; display: grid; gap: 8px; padding-left: 18px; }
    .field-list li { color: var(--text-secondary); }
    @media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }
  `],
})
export class FormsComponent implements OnInit {
  forms = signal<ConsultationForm[]>([]);
  responses = signal<FormResponse[]>([]);
  draftFields = signal<ConsultationForm['fields']>([]);

  newField: { label: string; type: FormFieldType; required: boolean } = {
    label: '',
    type: 'text',
    required: false,
  };

  constructor(
    private readonly mockData: MockDataService,
    private readonly notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.mockData.getConsultationForms().subscribe((forms) => this.forms.set(forms));
    this.mockData.getFormResponses().subscribe((responses) => this.responses.set(responses));
  }

  addField(): void {
    if (!this.newField.label.trim()) {
      this.notification.warning('Field label required', 'Please provide a label.');
      return;
    }
    this.draftFields.update((list) => [
      ...list,
      {
        id: 'custom-' + Date.now(),
        label: this.newField.label,
        type: this.newField.type,
        required: this.newField.required,
      },
    ]);
    this.newField.label = '';
    this.notification.success('Field added', 'Dynamic form field added to draft.');
  }

  getFormTitle(formId: string): string {
    return this.forms().find((form) => form.id === formId)?.title ?? 'Unknown Form';
  }
}
