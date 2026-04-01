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
    <div class="page-wrapper">
      <div class="page-header"><h1 class="page-title">Consultation & Medical Forms</h1></div>

      <div class="card form-section">
        <div class="section-head"><h3>Dynamic Form Builder</h3></div>
        <div class="section-body">
          <div class="form-grid">
            <div class="form-group"><label>Field Label</label><input class="input" placeholder="Field label" [(ngModel)]="newField.label" /></div>
            <div class="form-group"><label>Field Type</label><select class="input" [(ngModel)]="newField.type"><option value="text">Text</option><option value="textarea">Textarea</option><option value="select">Select</option><option value="checkbox">Checkbox</option><option value="radio">Radio</option><option value="number">Number</option></select></div>
            <div class="form-group" style="display:flex;align-items:flex-end;gap:8px"><label class="cb-label"><input type="checkbox" [(ngModel)]="newField.required" /> Required</label><button class="btn-secondary btn-sm" (click)="addField()">+ Add</button></div>
          </div>
          @if (draftFields().length) {
            <div class="fields-preview">
              @for (f of draftFields(); track f.id) {
                <div class="field-chip"><span>{{ f.label }}</span><span class="badge-primary">{{ f.type }}</span></div>
              }
            </div>
          }
        </div>
      </div>

      <div class="card table-section">
        <div class="section-head"><h3>Responses & Restrictions</h3><span class="count">{{ responses().length }}</span></div>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Customer</th><th>Form</th><th>Submitted</th><th>Restrictions</th></tr></thead>
            <tbody>@for (r of responses(); track r.id) {
              <tr>
                <td class="cell-name">{{ r.customerName }}</td><td>{{ getFormTitle(r.formId) }}</td><td>{{ r.submittedAt }}</td>
                <td>@if (r.restrictions.length === 0) { <span class="badge-success">None</span> } @else { <span class="badge-danger">{{ r.restrictions.join(', ') }}</span> }</td>
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
    .form-section, .table-section { overflow: hidden; margin-bottom: 16px; }
    .section-head { display: flex; align-items: center; gap: 8px; padding: 14px 20px; border-bottom: 1px solid var(--border-color); h3 { font-size: 0.9375rem; font-weight: 600; } }
    .count { font-size: 0.6875rem; padding: 2px 8px; background: var(--color-primary-50); color: var(--color-primary-dark); border-radius: var(--radius-full); font-weight: 600; }
    .section-body { padding: 20px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; }
    .form-group { label { display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; } }
    .cb-label { display: flex; align-items: center; gap: 6px; font-size: 0.8125rem; color: var(--text-secondary); cursor: pointer; input { accent-color: var(--color-primary); } }
    .fields-preview { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-color-light); }
    .field-chip { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: var(--bg-hover); border-radius: var(--radius-md); font-size: 0.8125rem; }
    .cell-name { font-weight: 600; }
    @media (max-width: 960px) { .form-grid { grid-template-columns: 1fr; } }
    @media (max-width: 768px) { .page-wrapper { padding: 16px; } }
  `],
})
export class FormsComponent implements OnInit {
  forms = signal<ConsultationForm[]>([]);
  responses = signal<FormResponse[]>([]);
  draftFields = signal<ConsultationForm['fields']>([]);
  newField: { label: string; type: FormFieldType; required: boolean } = { label: '', type: 'text', required: false };

  constructor(private readonly mockData: MockDataService, private readonly notification: NotificationService) {}
  ngOnInit(): void {
    this.mockData.getConsultationForms().subscribe(f => this.forms.set(f));
    this.mockData.getFormResponses().subscribe(r => this.responses.set(r));
  }

  addField(): void {
    if (!this.newField.label.trim()) { this.notification.warning('Required', 'Provide label'); return; }
    this.draftFields.update(list => [...list, { id: 'custom-' + Date.now(), label: this.newField.label, type: this.newField.type, required: this.newField.required }]);
    this.newField.label = '';
    this.notification.success('Added', 'Field added to draft');
  }

  getFormTitle(formId: string): string { return this.forms().find(f => f.id === formId)?.title ?? 'Unknown'; }
}
