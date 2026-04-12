import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

// ─── Models ───────────────────────────────────────────────────────────────────
export interface Area {
  id: number; code: string; description: string; maxCapacity: number;
  forGroup: boolean; sharedByEmployee: boolean; active: boolean;
  order: number; availableOnline: boolean; groupId?: number;
}
export interface AreaGroup {
  id: number; description: string;
}
export interface Package {
  id: number; code: string; shortDescription: string; longDescription: string;
  category: string; durationType: string; duration: number;
  services: number; active: boolean;
}
export interface ServiceGroup {
  id: number; code: string; description: string; active: boolean; order: number;
}
export interface Service {
  id: number; code: string; name: string; groupId: number; groupName: string;
  duration: number; price: number; active: boolean; availableOnline: boolean;
}

type SubPage = 'areas' | 'area-groups' | 'packages' | 'service-groups' | 'services';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent {
  activePage = signal<SubPage>('areas');

  // ─── Sub-nav items ────────────────────────────────────────────────────────
  readonly subNavItems: { page: SubPage; label: string; icon: string }[] = [
    { page: 'areas', label: 'Areas', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
    { page: 'area-groups', label: 'Area Groups', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M3 14h18"/><circle cx="12" cy="19" r="2"/></svg>' },
    { page: 'packages', label: 'Packages', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' },
    { page: 'service-groups', label: 'Service Groups', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' },
    { page: 'services', label: 'Services', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
  ];

  // ─── Areas ────────────────────────────────────────────────────────────────
  areas = signal<Area[]>([
    { id: 1, code: 'ALV', description: 'Aloe Vera', maxCapacity: 1, forGroup: false, sharedByEmployee: true, active: true, order: 1, availableOnline: true, groupId: 1 },
    { id: 2, code: 'TAN', description: 'Tangerine', maxCapacity: 1, forGroup: false, sharedByEmployee: true, active: true, order: 2, availableOnline: true, groupId: 1 },
    { id: 3, code: 'EUC', description: 'Eucalyptus', maxCapacity: 2, forGroup: false, sharedByEmployee: true, active: true, order: 3, availableOnline: true, groupId: 1 },
    { id: 4, code: 'CHA', description: 'Chamomile', maxCapacity: 2, forGroup: false, sharedByEmployee: true, active: true, order: 4, availableOnline: true, groupId: 1 },
    { id: 5, code: 'YYG', description: 'Ylang Ylang', maxCapacity: 1, forGroup: false, sharedByEmployee: true, active: true, order: 5, availableOnline: false, groupId: 1 },
    { id: 6, code: 'BTH1', description: 'Bath1', maxCapacity: 1, forGroup: false, sharedByEmployee: true, active: true, order: 6, availableOnline: true, groupId: 2 },
    { id: 7, code: 'BTH2', description: 'Bath2', maxCapacity: 1, forGroup: false, sharedByEmployee: true, active: true, order: 7, availableOnline: true, groupId: 2 },
    { id: 8, code: 'MAN', description: 'Manicure Room', maxCapacity: 2, forGroup: false, sharedByEmployee: true, active: true, order: 8, availableOnline: true, groupId: 3 },
    { id: 9, code: 'PED', description: 'Pedicure Room', maxCapacity: 2, forGroup: false, sharedByEmployee: true, active: true, order: 9, availableOnline: true, groupId: 3 },
    { id: 10, code: 'HAR', description: 'Hair Salon', maxCapacity: 4, forGroup: false, sharedByEmployee: true, active: true, order: 10, availableOnline: true, groupId: 3 },
    { id: 11, code: 'GYM', description: 'Gymnasium', maxCapacity: 1, forGroup: true, sharedByEmployee: true, active: true, order: 11, availableOnline: false, groupId: 2 },
    { id: 12, code: 'YOG', description: 'Yoga Room', maxCapacity: 9, forGroup: true, sharedByEmployee: true, active: true, order: 12, availableOnline: true, groupId: 2 },
  ]);

  // ─── Area Groups ──────────────────────────────────────────────────────────
  areaGroups = signal<AreaGroup[]>([
    { id: 1, description: 'Indoor Segment' },
    { id: 2, description: 'Outdoor Segment' },
    { id: 3, description: 'Pool Segment' },
  ]);

  // ─── Packages ─────────────────────────────────────────────────────────────
  packages = signal<Package[]>([
    { id: 1, code: 'WELL1', shortDescription: 'WELLBEING ANASSA BOOSTER', longDescription: 'Booster wellness package', category: 'Combosale Open', durationType: 'Years', duration: 1, services: 4, active: true },
    { id: 2, code: 'WELL2', shortDescription: 'WELLBEING ANASSA THALASSO EXPERIENCE', longDescription: 'Thalasso experience package', category: 'Combosale Closed', durationType: 'Years', duration: 1, services: 4, active: true },
    { id: 3, code: 'WELL3', shortDescription: 'WELLBEING ANASSA DISCOVER & UNWIND', longDescription: 'Discover and unwind package', category: 'Combosale Closed', durationType: 'Years', duration: 1, services: 4, active: true },
    { id: 4, code: 'WELL4', shortDescription: 'WELLBEING ANASSA LUXURY REMEDY', longDescription: 'Luxury remedy package', category: 'Combosale Closed', durationType: 'Years', duration: 1, services: 4, active: true },
  ]);

  // ─── Service Groups ───────────────────────────────────────────────────────
  serviceGroups = signal<ServiceGroup[]>([
    { id: 1, code: 'MSG', description: 'Massage Therapies', active: true, order: 1 },
    { id: 2, code: 'FAC', description: 'Facial Treatments', active: true, order: 2 },
    { id: 3, code: 'BOD', description: 'Body Treatments', active: true, order: 3 },
    { id: 4, code: 'NAL', description: 'Nail Services', active: true, order: 4 },
    { id: 5, code: 'HAR', description: 'Hair Services', active: true, order: 5 },
    { id: 6, code: 'WEL', description: 'Wellness Packages', active: true, order: 6 },
  ]);

  // ─── Services ─────────────────────────────────────────────────────────────
  services = signal<Service[]>([
    { id: 1, code: 'SWE60', name: 'Swedish Massage', groupId: 1, groupName: 'Massage Therapies', duration: 60, price: 120, active: true, availableOnline: true },
    { id: 2, code: 'DTP75', name: 'Deep Tissue Massage', groupId: 1, groupName: 'Massage Therapies', duration: 75, price: 150, active: true, availableOnline: true },
    { id: 3, code: 'HST90', name: 'Hot Stone Therapy', groupId: 1, groupName: 'Massage Therapies', duration: 90, price: 180, active: true, availableOnline: true },
    { id: 4, code: 'ARO60', name: 'Aromatherapy Massage', groupId: 1, groupName: 'Massage Therapies', duration: 60, price: 135, active: true, availableOnline: true },
    { id: 5, code: 'HYD45', name: 'Hydrating Facial', groupId: 2, groupName: 'Facial Treatments', duration: 45, price: 95, active: true, availableOnline: true },
    { id: 6, code: 'AAF60', name: 'Anti-Aging Facial', groupId: 2, groupName: 'Facial Treatments', duration: 60, price: 145, active: true, availableOnline: true },
    { id: 7, code: 'BWR75', name: 'Body Wrap', groupId: 3, groupName: 'Body Treatments', duration: 75, price: 160, active: true, availableOnline: false },
    { id: 8, code: 'SSE45', name: 'Salt Scrub Exfoliation', groupId: 3, groupName: 'Body Treatments', duration: 45, price: 85, active: true, availableOnline: true },
    { id: 9, code: 'GEL45', name: 'Gel Manicure', groupId: 4, groupName: 'Nail Services', duration: 45, price: 55, active: true, availableOnline: true },
    { id: 10, code: 'LUX60', name: 'Luxury Pedicure', groupId: 4, groupName: 'Nail Services', duration: 60, price: 75, active: true, availableOnline: true },
    { id: 11, code: 'HST60', name: 'Hair Styling', groupId: 5, groupName: 'Hair Services', duration: 60, price: 90, active: true, availableOnline: false },
    { id: 12, code: 'WPK180', name: 'Wellness Package', groupId: 6, groupName: 'Wellness Packages', duration: 180, price: 350, active: true, availableOnline: true },
  ]);

  // ─── Pagination ───────────────────────────────────────────────────────────
  pageSize = signal(10);
  currentPage = signal(1);
  readonly pageSizeOptions = [5, 10, 20, 50, 100];

  paginatedData = computed(() => {
    const data = this.currentPageData();
    const size = this.pageSize();
    const page = this.currentPage();
    const start = (page - 1) * size;
    return data.slice(start, start + size);
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.currentPageData().length / this.pageSize())));

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | '...')[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  });

  currentPageData(): unknown[] {
    switch (this.activePage()) {
      case 'areas': return this.areas();
      case 'area-groups': return this.areaGroups();
      case 'packages': return this.packages();
      case 'service-groups': return this.serviceGroups();
      case 'services': return this.services();
    }
  }

  // ─── Search ───────────────────────────────────────────────────────────────
  searchTerm = signal('');

  filteredAreas = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return this.areas().filter(a => !q || a.description.toLowerCase().includes(q) || a.code.toLowerCase().includes(q));
  });
  filteredAreaGroups = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return this.areaGroups().filter(a => !q || a.description.toLowerCase().includes(q));
  });
  filteredPackages = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return this.packages().filter(p => !q || p.shortDescription.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
  });
  filteredServiceGroups = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return this.serviceGroups().filter(g => !q || g.description.toLowerCase().includes(q) || g.code.toLowerCase().includes(q));
  });
  filteredServices = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return this.services().filter(s => !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.groupName.toLowerCase().includes(q));
  });

  paginatedAreas = computed(() => this.paginate(this.filteredAreas()));
  paginatedAreaGroups = computed(() => this.paginate(this.filteredAreaGroups()));
  paginatedPackages = computed(() => this.paginate(this.filteredPackages()));
  paginatedServiceGroups = computed(() => this.paginate(this.filteredServiceGroups()));
  paginatedServices = computed(() => this.paginate(this.filteredServices()));

  private paginate<T>(data: T[]): T[] {
    const size = this.pageSize();
    const page = this.currentPage();
    return data.slice((page - 1) * size, page * size);
  }

  totalItemsForPage = computed(() => {
    switch (this.activePage()) {
      case 'areas': return this.filteredAreas().length;
      case 'area-groups': return this.filteredAreaGroups().length;
      case 'packages': return this.filteredPackages().length;
      case 'service-groups': return this.filteredServiceGroups().length;
      case 'services': return this.filteredServices().length;
    }
  });

  totalPagesComputed = computed(() => Math.max(1, Math.ceil(this.totalItemsForPage() / this.pageSize())));

  pageNumbersComputed = computed(() => {
    const total = this.totalPagesComputed();
    const current = this.currentPage();
    const pages: (number | '...')[] = [];
    if (total <= 7) { for (let i = 1; i <= total; i++) pages.push(i); }
    else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  });

  // ─── Modal state ──────────────────────────────────────────────────────────
  showModal = signal(false);
  modalMode = signal<'add' | 'edit'>('add');
  editingId = signal<number | null>(null);

  // Form models
  areaForm = signal<Partial<Area>>({});
  areaGroupForm = signal<Partial<AreaGroup>>({});
  packageForm = signal<Partial<Package>>({});
  serviceGroupForm = signal<Partial<ServiceGroup>>({});
  serviceForm = signal<Partial<Service>>({});

  // ─── Navigation ───────────────────────────────────────────────────────────
  setPage(page: SubPage): void {
    this.activePage.set(page);
    this.currentPage.set(1);
    this.searchTerm.set('');
    this.showModal.set(false);
  }

  goToPage(p: number | '...'): void {
    if (p === '...') return;
    this.currentPage.set(Math.max(1, Math.min(p, this.totalPagesComputed())));
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  get pageTitle(): string {
    const map: Record<SubPage, string> = {
      'areas': 'Areas', 'area-groups': 'Area Groups',
      'packages': 'Packages', 'service-groups': 'Service Groups', 'services': 'Services'
    };
    return map[this.activePage()];
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────
  openAdd(): void {
    this.modalMode.set('add');
    this.editingId.set(null);
    this.resetForms();
    this.showModal.set(true);
  }

  openEdit(item: Area | AreaGroup | Package | ServiceGroup | Service): void {
    this.modalMode.set('edit');
    this.editingId.set(item.id);
    const page = this.activePage();
    if (page === 'areas') this.areaForm.set({ ...(item as Area) });
    else if (page === 'area-groups') this.areaGroupForm.set({ ...(item as AreaGroup) });
    else if (page === 'packages') this.packageForm.set({ ...(item as Package) });
    else if (page === 'service-groups') this.serviceGroupForm.set({ ...(item as ServiceGroup) });
    else if (page === 'services') this.serviceForm.set({ ...(item as Service) });
    this.showModal.set(true);
  }

  save(): void {
    const page = this.activePage();
    const mode = this.modalMode();
    if (page === 'areas') {
      const f = this.areaForm();
      if (!f.description) return;
      if (mode === 'add') {
        const newId = Math.max(0, ...this.areas().map(a => a.id)) + 1;
        this.areas.update(list => [...list, { id: newId, code: f.code ?? '', description: f.description!, maxCapacity: f.maxCapacity ?? 1, forGroup: f.forGroup ?? false, sharedByEmployee: f.sharedByEmployee ?? true, active: f.active ?? true, order: newId, availableOnline: f.availableOnline ?? true, groupId: f.groupId }]);
      } else {
        this.areas.update(list => list.map(a => a.id === this.editingId() ? { ...a, ...f } as Area : a));
      }
    } else if (page === 'area-groups') {
      const f = this.areaGroupForm();
      if (!f.description) return;
      if (mode === 'add') {
        const newId = Math.max(0, ...this.areaGroups().map(g => g.id)) + 1;
        this.areaGroups.update(list => [...list, { id: newId, description: f.description! }]);
      } else {
        this.areaGroups.update(list => list.map(g => g.id === this.editingId() ? { ...g, ...f } as AreaGroup : g));
      }
    } else if (page === 'packages') {
      const f = this.packageForm();
      if (!f.shortDescription) return;
      if (mode === 'add') {
        const newId = Math.max(0, ...this.packages().map(p => p.id)) + 1;
        this.packages.update(list => [...list, { id: newId, code: f.code ?? '', shortDescription: f.shortDescription!, longDescription: f.longDescription ?? '', category: f.category ?? 'Combosale Open', durationType: f.durationType ?? 'Years', duration: f.duration ?? 1, services: f.services ?? 0, active: f.active ?? true }]);
      } else {
        this.packages.update(list => list.map(p => p.id === this.editingId() ? { ...p, ...f } as Package : p));
      }
    } else if (page === 'service-groups') {
      const f = this.serviceGroupForm();
      if (!f.description) return;
      if (mode === 'add') {
        const newId = Math.max(0, ...this.serviceGroups().map(g => g.id)) + 1;
        this.serviceGroups.update(list => [...list, { id: newId, code: f.code ?? '', description: f.description!, active: f.active ?? true, order: newId }]);
      } else {
        this.serviceGroups.update(list => list.map(g => g.id === this.editingId() ? { ...g, ...f } as ServiceGroup : g));
      }
    } else if (page === 'services') {
      const f = this.serviceForm();
      if (!f.name) return;
      const grp = this.serviceGroups().find(g => g.id === f.groupId);
      if (mode === 'add') {
        const newId = Math.max(0, ...this.services().map(s => s.id)) + 1;
        this.services.update(list => [...list, { id: newId, code: f.code ?? '', name: f.name!, groupId: f.groupId ?? 1, groupName: grp?.description ?? '', duration: f.duration ?? 60, price: f.price ?? 0, active: f.active ?? true, availableOnline: f.availableOnline ?? true }]);
      } else {
        this.services.update(list => list.map(s => s.id === this.editingId() ? { ...s, ...f, groupName: grp?.description ?? s.groupName } as Service : s));
      }
    }
    this.showModal.set(false);
  }

  deleteItem(id: number): void {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const page = this.activePage();
    if (page === 'areas') this.areas.update(list => list.filter(a => a.id !== id));
    else if (page === 'area-groups') this.areaGroups.update(list => list.filter(g => g.id !== id));
    else if (page === 'packages') this.packages.update(list => list.filter(p => p.id !== id));
    else if (page === 'service-groups') this.serviceGroups.update(list => list.filter(g => g.id !== id));
    else if (page === 'services') this.services.update(list => list.filter(s => s.id !== id));
  }

  toggleActive(id: number): void {
    const page = this.activePage();
    if (page === 'areas') this.areas.update(list => list.map(a => a.id === id ? { ...a, active: !a.active } : a));
    else if (page === 'packages') this.packages.update(list => list.map(p => p.id === id ? { ...p, active: !p.active } : p));
    else if (page === 'service-groups') this.serviceGroups.update(list => list.map(g => g.id === id ? { ...g, active: !g.active } : g));
    else if (page === 'services') this.services.update(list => list.map(s => s.id === id ? { ...s, active: !s.active } : s));
  }

  private resetForms(): void {
    this.areaForm.set({ active: true, sharedByEmployee: true, availableOnline: true, forGroup: false, maxCapacity: 1 });
    this.areaGroupForm.set({});
    this.packageForm.set({ active: true, durationType: 'Years', duration: 1, services: 0 });
    this.serviceGroupForm.set({ active: true, order: 1 });
    this.serviceForm.set({ active: true, availableOnline: true, duration: 60, price: 0, groupId: 1 });
  }

  getGroupName(groupId?: number): string {
    return this.areaGroups().find(g => g.id === groupId)?.description ?? '—';
  }

  isNumber(val: number | '...'): val is number { return val !== '...'; }
}
