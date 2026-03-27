export interface ConsultationForm {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  isActive: boolean;
  createdAt: string;
}

export type FormFieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number';

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
  validation?: FormValidation;
}

export interface FormValidation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  customerId: string;
  customerName: string;
  responses: Record<string, string | string[] | boolean>;
  restrictions: string[];
  submittedAt: string;
}

export interface RestrictionAlert {
  customerId: string;
  customerName: string;
  restriction: string;
  severity: 'low' | 'medium' | 'high';
  notes: string;
}
