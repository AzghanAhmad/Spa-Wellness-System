import { Injectable, signal } from '@angular/core';
import { Questionnaire } from './configuration.component';

@Injectable({ providedIn: 'root' })
export class QuestionnaireService {
  questionnaires = signal<Questionnaire[]>([
    { id: 1, referenceToken: 'QST-2024-001', description: 'New Client Health Questionnaire', status: 'Active', updateCustomerInfo: true, activeFrom: '2024-01-01', activeTo: '', answersValidDays: 365, groups: [
      { id: 1, title: 'Spa Consultation Form', type: 'Profile', order: 1, questions: [
        { id: 1, label: 'Full Name', type: 'text', required: true, options: [], placeholder: 'Enter your full name', order: 1 },
        { id: 2, label: 'Date of Birth', type: 'date', required: true, options: [], placeholder: '', order: 2 },
        { id: 3, label: 'Gender', type: 'radio', required: true, options: [{ id: 1, label: 'Male' }, { id: 2, label: 'Female' }, { id: 3, label: 'Other' }], placeholder: '', order: 3 },
      ]},
      { id: 2, title: 'Treatment', type: 'Question', order: 2, questions: [
        { id: 4, label: 'Do you have any allergies?', type: 'textarea', required: true, options: [], placeholder: 'List any allergies...', order: 1 },
        { id: 5, label: 'Are you currently pregnant?', type: 'yesno', required: true, options: [], placeholder: '', order: 2 },
      ]},
      { id: 3, title: 'Medical Information', type: 'Question', order: 3, questions: [
        { id: 6, label: 'Current medications', type: 'textarea', required: false, options: [], placeholder: 'List current medications...', order: 1 },
        { id: 7, label: 'Medical conditions', type: 'checkbox', required: false, options: [{ id: 1, label: 'Heart condition' }, { id: 2, label: 'High blood pressure' }, { id: 3, label: 'Diabetes' }, { id: 4, label: 'None' }], placeholder: '', order: 2 },
      ]},
    ]},
    { id: 2, referenceToken: 'QST-2024-002', description: 'Facial Treatment Consultation', status: 'Active', updateCustomerInfo: false, activeFrom: '2024-02-01', activeTo: '', answersValidDays: 180, groups: [
      { id: 4, title: 'Skin Profile', type: 'Profile', order: 1, questions: [
        { id: 8, label: 'Skin type', type: 'select', required: true, options: [{ id: 1, label: 'Normal' }, { id: 2, label: 'Dry' }, { id: 3, label: 'Oily' }, { id: 4, label: 'Combination' }, { id: 5, label: 'Sensitive' }], placeholder: '', order: 1 },
        { id: 9, label: 'Skin concerns', type: 'checkbox', required: true, options: [{ id: 1, label: 'Acne' }, { id: 2, label: 'Aging' }, { id: 3, label: 'Pigmentation' }, { id: 4, label: 'Redness' }], placeholder: '', order: 2 },
      ]},
    ]},
  ]);
}
