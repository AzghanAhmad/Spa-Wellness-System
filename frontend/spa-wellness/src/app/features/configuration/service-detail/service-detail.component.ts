import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationComponent, Service, Area } from '../configuration.component';
import { ServiceDetailService, EmployeeException, MedicalCondition, TaxGroup, PriceEntry } from '../service-detail.service';

type DetailTab = 'areas' | 'employee-exceptions' | 'medical-conditions' | 'tax-groups' | 'price-lists' | 'audit';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss'
})
export class ServiceDetailComponent implements OnInit {
  service = signal<Service | null>(null);
  activeTab = signal<DetailTab>('areas');
  areaSearchTerm = signal('');
  areaSelection = signal<number[]>([]);
  selectedAreaSelection = signal<number[]>([]);

  newEmployeeException = signal<{ employeeId: string; reason: string }>({ employeeId: '', reason: '' });
  newMedicalCondition = signal<{ condition: string; notes: string }>({ condition: '', notes: '' });
  newTaxGroup = signal<{ name: string; type: string; rate: number }>({ name: '', type: 'Percentage', rate: 0 });
  newPriceEntry = signal<{ pricingId: number; price: number; taxIncluded: boolean; effectiveFrom: string; effectiveTo: string }>({ pricingId: 1, price: 0, taxIncluded: true, effectiveFrom: new Date().toISOString().split('T')[0], effectiveTo: '' });

  readonly taxTypes = ['Percentage', 'Fixed', 'Exempt'];
  readonly employeeList = [
    { id: 't1', name: 'Emma Wilson' }, { id: 't2', name: 'Olivia Martinez' },
    { id: 't3', name: 'Sophia Kim' }, { id: 't4', name: 'Isabella Davis' }, { id: 't5', name: 'Mia Johnson' }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly config: ConfigurationComponent,
    private readonly sds: ServiceDetailService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.config.services().find(s => s.id === id);
    if (!found) { this.router.navigate(['/configuration']); return; }
    this.service.set(found);
    this.sds.getOrInit(found);
  }

  goBack(): void { this.router.navigate(['/configuration'], { queryParams: { page: 'services' } }); }

  get data() { return this.sds.get(this.service()!.id)!; }

  // ─── Areas ────────────────────────────────────────────────────────────────
  availableAreas = computed(() => {
    const svc = this.service(); if (!svc) return [];
    const selected = this.sds.get(svc.id)?.areas ?? [];
    const q = this.areaSearchTerm().toLowerCase();
    return this.config.areas().filter(a => !selected.includes(a.id) && (!q || a.description.toLowerCase().includes(q)));
  });

  selectedAreas = computed(() => {
    const svc = this.service(); if (!svc) return [];
    const selected = this.sds.get(svc.id)?.areas ?? [];
    return this.config.areas().filter(a => selected.includes(a.id));
  });

  toggleAreaSel(id: number): void { this.areaSelection.update(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]); }
  toggleSelectedAreaSel(id: number): void { this.selectedAreaSelection.update(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]); }

  addAreas(): void {
    const svc = this.service(); if (!svc) return;
    const d = this.data;
    this.sds.update(svc.id, { areas: [...d.areas, ...this.areaSelection()] });
    this.areaSelection.set([]);
  }

  removeAreas(): void {
    const svc = this.service(); if (!svc) return;
    const toRemove = this.selectedAreaSelection();
    this.sds.update(svc.id, { areas: this.data.areas.filter(id => !toRemove.includes(id)) });
    this.selectedAreaSelection.set([]);
  }

  // ─── Employee exceptions ──────────────────────────────────────────────────
  addEmployeeException(): void {
    const svc = this.service(); if (!svc) return;
    const f = this.newEmployeeException(); if (!f.employeeId) return;
    const emp = this.employeeList.find(e => e.id === f.employeeId);
    const newId = Math.max(0, ...this.data.employeeExceptions.map(e => e.id)) + 1;
    this.sds.update(svc.id, { employeeExceptions: [...this.data.employeeExceptions, { id: newId, employeeId: f.employeeId, employeeName: emp?.name ?? f.employeeId, reason: f.reason }] });
    this.newEmployeeException.set({ employeeId: '', reason: '' });
  }

  removeEmployeeException(id: number): void {
    const svc = this.service(); if (!svc) return;
    this.sds.update(svc.id, { employeeExceptions: this.data.employeeExceptions.filter(e => e.id !== id) });
  }

  // ─── Medical conditions ───────────────────────────────────────────────────
  addMedicalCondition(): void {
    const svc = this.service(); if (!svc) return;
    const f = this.newMedicalCondition(); if (!f.condition) return;
    const newId = Math.max(0, ...this.data.medicalConditions.map(c => c.id)) + 1;
    this.sds.update(svc.id, { medicalConditions: [...this.data.medicalConditions, { id: newId, condition: f.condition, notes: f.notes }] });
    this.newMedicalCondition.set({ condition: '', notes: '' });
  }

  removeMedicalCondition(id: number): void {
    const svc = this.service(); if (!svc) return;
    this.sds.update(svc.id, { medicalConditions: this.data.medicalConditions.filter(c => c.id !== id) });
  }

  // ─── Tax groups ───────────────────────────────────────────────────────────
  addTaxGroup(): void {
    const svc = this.service(); if (!svc) return;
    const f = this.newTaxGroup(); if (!f.name) return;
    const newId = Math.max(0, ...this.data.taxGroups.map(t => t.id)) + 1;
    this.sds.update(svc.id, { taxGroups: [...this.data.taxGroups, { id: newId, name: f.name, type: f.type, rate: f.rate }] });
    this.newTaxGroup.set({ name: '', type: 'Percentage', rate: 0 });
  }

  removeTaxGroup(id: number): void {
    const svc = this.service(); if (!svc) return;
    this.sds.update(svc.id, { taxGroups: this.data.taxGroups.filter(t => t.id !== id) });
  }

  // ─── Price lists ──────────────────────────────────────────────────────────
  addPriceEntry(): void {
    const svc = this.service(); if (!svc) return;
    const f = this.newPriceEntry();
    const pricing = this.config.pricings().find(p => p.id === f.pricingId);
    const newId = Math.max(0, ...this.data.priceLists.map(p => p.id)) + 1;
    const newHistory = { id: (this.data.priceHistory.length + 1), pricingName: pricing?.shortDescription ?? '', oldPrice: svc.price, newPrice: f.price, changedBy: 'Admin', changedAt: new Date().toLocaleString() };
    this.sds.update(svc.id, {
      priceLists: [...this.data.priceLists, { id: newId, pricingId: f.pricingId, pricingName: pricing?.shortDescription ?? '', price: f.price, taxIncluded: f.taxIncluded, effectiveFrom: f.effectiveFrom, effectiveTo: f.effectiveTo, active: true }],
      priceHistory: [newHistory, ...this.data.priceHistory],
    });
    this.newPriceEntry.set({ pricingId: 1, price: 0, taxIncluded: true, effectiveFrom: new Date().toISOString().split('T')[0], effectiveTo: '' });
  }

  removePriceEntry(id: number): void {
    const svc = this.service(); if (!svc) return;
    this.sds.update(svc.id, { priceLists: this.data.priceLists.filter(p => p.id !== id) });
  }

  getAreaGroupName(groupId?: number): string {
    return this.config.areaGroups().find(g => g.id === groupId)?.description ?? '—';
  }
}
