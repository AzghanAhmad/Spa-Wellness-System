import { Injectable, signal } from '@angular/core';
import { Service, Area } from './configuration.component';

export interface EmployeeException { id: number; employeeId: string; employeeName: string; reason: string; }
export interface MedicalCondition { id: number; condition: string; notes: string; }
export interface TaxGroup { id: number; name: string; type: string; rate: number; }
export interface PriceEntry { id: number; pricingId: number; pricingName: string; price: number; taxIncluded: boolean; effectiveFrom: string; effectiveTo: string; active: boolean; }
export interface PriceHistory { id: number; pricingName: string; oldPrice: number; newPrice: number; changedBy: string; changedAt: string; }
export interface AuditEntry { id: number; action: string; field: string; oldValue: string; newValue: string; changedBy: string; changedAt: string; }

export interface ServiceDetailData {
  areas: number[];
  employeeExceptions: EmployeeException[];
  medicalConditions: MedicalCondition[];
  taxGroups: TaxGroup[];
  priceLists: PriceEntry[];
  priceHistory: PriceHistory[];
  auditLog: AuditEntry[];
}

@Injectable({ providedIn: 'root' })
export class ServiceDetailService {
  private store = signal<Record<number, ServiceDetailData>>({});

  getOrInit(svc: Service): ServiceDetailData {
    const existing = this.store()[svc.id];
    if (existing) return existing;
    const data: ServiceDetailData = {
      areas: [1, 3],
      employeeExceptions: [],
      medicalConditions: [
        { id: 1, condition: 'Recent surgery (within 6 weeks)', notes: 'Avoid direct pressure on surgical area' },
        { id: 2, condition: 'Severe skin conditions', notes: 'Consult dermatologist first' },
      ],
      taxGroups: [{ id: 1, name: 'Standard VAT', type: 'Percentage', rate: 20 }],
      priceLists: [
        { id: 1, pricingId: 1, pricingName: 'Official', price: svc.price, taxIncluded: true, effectiveFrom: '2024-01-01', effectiveTo: '', active: true },
        { id: 2, pricingId: 2, pricingName: 'Maison', price: Math.round(svc.price * 1.2), taxIncluded: true, effectiveFrom: '2024-01-01', effectiveTo: '', active: true },
      ],
      priceHistory: [
        { id: 1, pricingName: 'Official', oldPrice: Math.round(svc.price * 0.9), newPrice: svc.price, changedBy: 'Admin', changedAt: '2024-03-01 09:00' },
        { id: 2, pricingName: 'Official', oldPrice: Math.round(svc.price * 0.8), newPrice: Math.round(svc.price * 0.9), changedBy: 'Admin', changedAt: '2023-09-15 14:30' },
      ],
      auditLog: [
        { id: 1, action: 'Updated', field: 'Price', oldValue: String(Math.round(svc.price * 0.9)), newValue: String(svc.price), changedBy: 'Admin', changedAt: '2024-03-01 09:00' },
        { id: 2, action: 'Updated', field: 'Status', oldValue: 'Inactive', newValue: 'Active', changedBy: 'Admin', changedAt: '2024-01-01 10:00' },
        { id: 3, action: 'Created', field: '—', oldValue: '—', newValue: '—', changedBy: 'Admin', changedAt: '2023-06-01 08:00' },
      ],
    };
    this.store.update(m => ({ ...m, [svc.id]: data }));
    return data;
  }

  update(serviceId: number, data: Partial<ServiceDetailData>): void {
    this.store.update(m => ({ ...m, [serviceId]: { ...m[serviceId], ...data } }));
  }

  get(serviceId: number): ServiceDetailData | undefined {
    return this.store()[serviceId];
  }
}
