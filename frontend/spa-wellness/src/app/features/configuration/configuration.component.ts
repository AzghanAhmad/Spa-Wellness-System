import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── Models ───────────────────────────────────────────────────────────────────
export interface Area { id: number; code: string; description: string; maxCapacity: number; forGroup: boolean; sharedByEmployee: boolean; active: boolean; order: number; availableOnline: boolean; groupId?: number; }
export interface AreaGroup { id: number; description: string; }
export interface Package { id: number; code: string; shortDescription: string; longDescription: string; category: string; durationType: string; duration: number; services: number; active: boolean; }
export interface ServiceGroup { id: number; code: string; description: string; active: boolean; order: number; }
export interface Service { id: number; code: string; name: string; description: string; groupId: number; groupName: string; duration: number; price: number; status: string; type: string; barcode: string; active: boolean; availableOnline: boolean; }
export interface ProductGroup { id: number; code: string; description: string; active: boolean; }
export interface Product { id: number; code: string; name: string; description: string; groupId: number; groupName: string; price: number; status: string; barcode: string; active: boolean; }
export interface Supplier { id: number; code: string; name: string; contactPerson: string; email: string; phone: string; address: string; active: boolean; }

export type SubPage = 'areas' | 'area-groups' | 'packages' | 'service-groups' | 'services' | 'product-groups' | 'products' | 'suppliers';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent {
  activePage = signal<SubPage>('areas');

  readonly subNavItems: { page: SubPage; label: string; icon: string }[] = [
    { page: 'areas', label: 'Areas', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
    { page: 'area-groups', label: 'Area Groups', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M3 14h18"/><circle cx="12" cy="19" r="2"/></svg>' },
    { page: 'packages', label: 'Packages', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' },
    { page: 'service-groups', label: 'Service Groups', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' },
    { page: 'services', label: 'Services', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
    { page: 'product-groups', label: 'Product Groups', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' },
    { page: 'products', label: 'Products', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>' },
    { page: 'suppliers', label: 'Suppliers', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  ];

  // ─── Data ─────────────────────────────────────────────────────────────────
  areas = signal<Area[]>([
    { id: 1, code: 'ALV', description: 'Aloe Vera', maxCapacity: 1, forGroup: false, sharedByEmployee: true, active: true, order: 1, availableOnline: true, groupId: 1 },
    { id: 2, code: 'TAN', description: 'Tangerine', maxCapacity: 1, forGroup: false, sharedByEmployee: true, active: true, order: 2, availableOnline: true, groupId: 1 },
    { id: 3, code: 'EUC', description: 'Eucalyptus', maxCapacity: 2, forGroup: false, sharedByEmployee: true, active: true, order: 3, availableOnline: true, groupId: 1 },
    { id: 4, code: 'CHA', description: 'Chamomile', maxCapacity: 2, forGroup: false, sharedByEmployee: true, active: true, order: 4, availableOnline: true, groupId: 1 },
    { id: 5, code: 'YYG', description: 'Ylang Ylang', maxCapacity: 1, forGroup: false, sharedByEmployee: true, active: true, order: 5, availableOnline: false, groupId: 1 },
    { id: 6, code: 'BTH1', description: 'Bath 1', maxCapacity: 1, forGroup: false, sharedByEmployee: true, active: true, order: 6, availableOnline: true, groupId: 2 },
    { id: 7, code: 'BTH2', description: 'Bath 2', maxCapacity: 1, forGroup: false, sharedByEmployee: true, active: true, order: 7, availableOnline: true, groupId: 2 },
    { id: 8, code: 'MAN', description: 'Manicure Room', maxCapacity: 2, forGroup: false, sharedByEmployee: true, active: true, order: 8, availableOnline: true, groupId: 3 },
    { id: 9, code: 'PED', description: 'Pedicure Room', maxCapacity: 2, forGroup: false, sharedByEmployee: true, active: true, order: 9, availableOnline: true, groupId: 3 },
    { id: 10, code: 'HAR', description: 'Hair Salon', maxCapacity: 4, forGroup: false, sharedByEmployee: true, active: true, order: 10, availableOnline: true, groupId: 3 },
    { id: 11, code: 'GYM', description: 'Gymnasium', maxCapacity: 1, forGroup: true, sharedByEmployee: true, active: true, order: 11, availableOnline: false, groupId: 2 },
    { id: 12, code: 'YOG', description: 'Yoga Room', maxCapacity: 9, forGroup: true, sharedByEmployee: true, active: true, order: 12, availableOnline: true, groupId: 2 },
  ]);

  areaGroups = signal<AreaGroup[]>([
    { id: 1, description: 'Indoor Segment' },
    { id: 2, description: 'Outdoor Segment' },
    { id: 3, description: 'Pool Segment' },
  ]);

  packages = signal<Package[]>([
    { id: 1, code: 'WELL1', shortDescription: 'Wellbeing Anassa Booster', longDescription: 'Booster wellness package', category: 'Combosale Open', durationType: 'Years', duration: 1, services: 4, active: true },
    { id: 2, code: 'WELL2', shortDescription: 'Wellbeing Thalasso Experience', longDescription: 'Thalasso experience package', category: 'Combosale Closed', durationType: 'Years', duration: 1, services: 4, active: true },
    { id: 3, code: 'WELL3', shortDescription: 'Wellbeing Discover & Unwind', longDescription: 'Discover and unwind package', category: 'Combosale Closed', durationType: 'Years', duration: 1, services: 4, active: true },
    { id: 4, code: 'WELL4', shortDescription: 'Wellbeing Luxury Remedy', longDescription: 'Luxury remedy package', category: 'Combosale Closed', durationType: 'Years', duration: 1, services: 4, active: true },
  ]);

  serviceGroups = signal<ServiceGroup[]>([
    { id: 1, code: 'MSG', description: 'Massage Therapies', active: true, order: 1 },
    { id: 2, code: 'FAC', description: 'Facial Treatments', active: true, order: 2 },
    { id: 3, code: 'BOD', description: 'Body Treatments', active: true, order: 3 },
    { id: 4, code: 'NAL', description: 'Nail Services', active: true, order: 4 },
    { id: 5, code: 'HAR', description: 'Hair Services', active: true, order: 5 },
    { id: 6, code: 'WEL', description: 'Wellness Packages', active: true, order: 6 },
  ]);

  services = signal<Service[]>([
    { id: 1, code: 'SWE60', name: 'Swedish Massage', description: 'A gentle full-body massage', groupId: 1, groupName: 'Massage Therapies', duration: 60, price: 120, status: 'Active', type: 'Therapy', barcode: '8901234560001', active: true, availableOnline: true },
    { id: 2, code: 'DTP75', name: 'Deep Tissue Massage', description: 'Targets deep muscle layers', groupId: 1, groupName: 'Massage Therapies', duration: 75, price: 150, status: 'Active', type: 'Therapy', barcode: '8901234560002', active: true, availableOnline: true },
    { id: 3, code: 'HST90', name: 'Hot Stone Therapy', description: 'Heated stones for tension relief', groupId: 1, groupName: 'Massage Therapies', duration: 90, price: 180, status: 'Active', type: 'Therapy', barcode: '8901234560003', active: true, availableOnline: true },
    { id: 4, code: 'ARO60', name: 'Aromatherapy Massage', description: 'Essential oil massage', groupId: 1, groupName: 'Massage Therapies', duration: 60, price: 135, status: 'Active', type: 'Therapy', barcode: '8901234560004', active: true, availableOnline: true },
    { id: 5, code: 'HYD45', name: 'Hydrating Facial', description: 'Deep moisturizing facial', groupId: 2, groupName: 'Facial Treatments', duration: 45, price: 95, status: 'Active', type: 'Treatment', barcode: '8901234560005', active: true, availableOnline: true },
    { id: 6, code: 'AAF60', name: 'Anti-Aging Facial', description: 'Reduces fine lines', groupId: 2, groupName: 'Facial Treatments', duration: 60, price: 145, status: 'Active', type: 'Treatment', barcode: '8901234560006', active: true, availableOnline: true },
    { id: 7, code: 'BWR75', name: 'Body Wrap', description: 'Detoxifying body wrap', groupId: 3, groupName: 'Body Treatments', duration: 75, price: 160, status: 'Active', type: 'Treatment', barcode: '8901234560007', active: true, availableOnline: false },
    { id: 8, code: 'SSE45', name: 'Salt Scrub Exfoliation', description: 'Full-body exfoliation', groupId: 3, groupName: 'Body Treatments', duration: 45, price: 85, status: 'Active', type: 'Treatment', barcode: '8901234560008', active: true, availableOnline: true },
    { id: 9, code: 'GEL45', name: 'Gel Manicure', description: 'Long-lasting gel manicure', groupId: 4, groupName: 'Nail Services', duration: 45, price: 55, status: 'Active', type: 'Beauty', barcode: '8901234560009', active: true, availableOnline: true },
    { id: 10, code: 'LUX60', name: 'Luxury Pedicure', description: 'Full pedicure treatment', groupId: 4, groupName: 'Nail Services', duration: 60, price: 75, status: 'Active', type: 'Beauty', barcode: '8901234560010', active: true, availableOnline: true },
    { id: 11, code: 'HST60', name: 'Hair Styling', description: 'Wash, cut and blow dry', groupId: 5, groupName: 'Hair Services', duration: 60, price: 90, status: 'Active', type: 'Beauty', barcode: '8901234560011', active: true, availableOnline: false },
    { id: 12, code: 'WPK180', name: 'Wellness Package', description: 'Complete day package', groupId: 6, groupName: 'Wellness Packages', duration: 180, price: 350, status: 'Active', type: 'Package', barcode: '8901234560012', active: true, availableOnline: true },
  ]);

  productGroups = signal<ProductGroup[]>([
    { id: 1, code: 'SKN', description: 'Skincare', active: true },
    { id: 2, code: 'ARO', description: 'Aromatherapy', active: true },
    { id: 3, code: 'HAR', description: 'Hair Care', active: true },
    { id: 4, code: 'SLP', description: 'Sleep & Wellness', active: true },
    { id: 5, code: 'NAL', description: 'Nail Care', active: true },
  ]);

  products = signal<Product[]>([
    { id: 1, code: 'SKN001', name: 'Hydrating Face Cream', description: 'Deep moisturizing cream for all skin types', groupId: 1, groupName: 'Skincare', price: 45, status: 'Active', barcode: '8100469863630', active: true },
    { id: 2, code: 'SKN002', name: 'Anti-Aging Serum', description: 'Reduces fine lines and wrinkles', groupId: 1, groupName: 'Skincare', price: 85, status: 'Active', barcode: '8100469863631', active: true },
    { id: 3, code: 'ARO001', name: 'Lavender Essential Oil', description: 'Pure lavender oil for relaxation', groupId: 2, groupName: 'Aromatherapy', price: 28, status: 'Active', barcode: '8100469863632', active: true },
    { id: 4, code: 'ARO002', name: 'Eucalyptus Oil', description: 'Refreshing eucalyptus essential oil', groupId: 2, groupName: 'Aromatherapy', price: 24, status: 'Active', barcode: '8100469863633', active: true },
    { id: 5, code: 'HAR001', name: 'Nourishing Hair Mask', description: 'Deep conditioning hair treatment', groupId: 3, groupName: 'Hair Care', price: 32, status: 'Active', barcode: '8100469863634', active: true },
    { id: 6, code: 'SLP001', name: 'Sleep Pillow Mist', description: 'Calming mist for better sleep', groupId: 4, groupName: 'Sleep & Wellness', price: 22, status: 'Active', barcode: '8100469863635', active: true },
    { id: 7, code: 'NAL001', name: 'Cuticle Oil', description: 'Nourishing cuticle treatment oil', groupId: 5, groupName: 'Nail Care', price: 15, status: 'Active', barcode: '8100469863636', active: true },
    { id: 8, code: 'SKN003', name: 'Body Scrub', description: 'Exfoliating sea salt body scrub', groupId: 1, groupName: 'Skincare', price: 38, status: 'Active', barcode: '8100469863637', active: true },
  ]);

  suppliers = signal<Supplier[]>([
    { id: 1, code: 'SUP001', name: 'Natura Essentials Ltd', contactPerson: 'Maria Santos', email: 'maria@naturaessentials.com', phone: '+1-555-0401', address: '12 Green Lane, New York, NY 10001', active: true },
    { id: 2, code: 'SUP002', name: 'Aromatherapy World', contactPerson: 'James Chen', email: 'james@aromatherapyworld.com', phone: '+1-555-0402', address: '45 Blossom Ave, Los Angeles, CA 90001', active: true },
    { id: 3, code: 'SUP003', name: 'Pure Wellness Co.', contactPerson: 'Sarah Williams', email: 'sarah@purewellness.com', phone: '+1-555-0403', address: '78 Spa Road, Miami, FL 33101', active: true },
    { id: 4, code: 'SUP004', name: 'Luxury Beauty Supply', contactPerson: 'David Park', email: 'david@luxurybeauty.com', phone: '+1-555-0404', address: '99 Glamour St, Chicago, IL 60601', active: false },
    { id: 5, code: 'SUP005', name: 'Organic Spa Imports', contactPerson: 'Emma Wilson', email: 'emma@organicspa.com', phone: '+1-555-0405', address: '33 Natural Way, Seattle, WA 98101', active: true },
  ]);

  // ─── Pagination & Search ──────────────────────────────────────────────────
  pageSize = signal(10);
  currentPage = signal(1);
  readonly pageSizeOptions = [5, 10, 20, 50, 100];
  searchTerm = signal('');
  serviceGroupFilter = signal<number | null>(null); // for services group filter
  productGroupFilter = signal<number | null>(null); // for products group filter

  private paginate<T>(data: T[]): T[] {
    const size = this.pageSize();
    const page = this.currentPage();
    return data.slice((page - 1) * size, page * size);
  }

  filteredAreas = computed(() => { const q = this.searchTerm().toLowerCase(); return this.areas().filter(a => !q || a.description.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)); });
  filteredAreaGroups = computed(() => { const q = this.searchTerm().toLowerCase(); return this.areaGroups().filter(a => !q || a.description.toLowerCase().includes(q)); });
  filteredPackages = computed(() => { const q = this.searchTerm().toLowerCase(); return this.packages().filter(p => !q || p.shortDescription.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)); });
  filteredServiceGroups = computed(() => { const q = this.searchTerm().toLowerCase(); return this.serviceGroups().filter(g => !q || g.description.toLowerCase().includes(q) || g.code.toLowerCase().includes(q)); });
  filteredServices = computed(() => {
    const q = this.searchTerm().toLowerCase();
    const gf = this.serviceGroupFilter();
    return this.services().filter(s => (!q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.barcode.includes(q)) && (!gf || s.groupId === gf));
  });
  filteredProductGroups = computed(() => { const q = this.searchTerm().toLowerCase(); return this.productGroups().filter(g => !q || g.description.toLowerCase().includes(q) || g.code.toLowerCase().includes(q)); });
  filteredProducts = computed(() => {
    const q = this.searchTerm().toLowerCase();
    const gf = this.productGroupFilter();
    return this.products().filter(p => (!q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.barcode.includes(q)) && (!gf || p.groupId === gf));
  });
  filteredSuppliers = computed(() => { const q = this.searchTerm().toLowerCase(); return this.suppliers().filter(s => !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.contactPerson.toLowerCase().includes(q)); });

  paginatedAreas = computed(() => this.paginate(this.filteredAreas()));
  paginatedAreaGroups = computed(() => this.paginate(this.filteredAreaGroups()));
  paginatedPackages = computed(() => this.paginate(this.filteredPackages()));
  paginatedServiceGroups = computed(() => this.paginate(this.filteredServiceGroups()));
  paginatedServices = computed(() => this.paginate(this.filteredServices()));
  paginatedProductGroups = computed(() => this.paginate(this.filteredProductGroups()));
  paginatedProducts = computed(() => this.paginate(this.filteredProducts()));
  paginatedSuppliers = computed(() => this.paginate(this.filteredSuppliers()));

  totalItemsForPage = computed(() => {
    switch (this.activePage()) {
      case 'areas': return this.filteredAreas().length;
      case 'area-groups': return this.filteredAreaGroups().length;
      case 'packages': return this.filteredPackages().length;
      case 'service-groups': return this.filteredServiceGroups().length;
      case 'services': return this.filteredServices().length;
      case 'product-groups': return this.filteredProductGroups().length;
      case 'products': return this.filteredProducts().length;
      case 'suppliers': return this.filteredSuppliers().length;
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

  // ─── Modal ────────────────────────────────────────────────────────────────
  showModal = signal(false);
  modalMode = signal<'add' | 'edit'>('add');
  editingId = signal<number | null>(null);

  areaForm = signal<Partial<Area>>({});
  areaGroupForm = signal<Partial<AreaGroup>>({});
  packageForm = signal<Partial<Package>>({});
  serviceGroupForm = signal<Partial<ServiceGroup>>({});
  serviceForm = signal<Partial<Service>>({});
  productGroupForm = signal<Partial<ProductGroup>>({});
  productForm = signal<Partial<Product>>({});
  supplierForm = signal<Partial<Supplier>>({});

  // ─── Navigation ───────────────────────────────────────────────────────────
  setPage(page: SubPage): void {
    this.activePage.set(page);
    this.currentPage.set(1);
    this.searchTerm.set('');
    this.serviceGroupFilter.set(null);
    this.productGroupFilter.set(null);
    this.showModal.set(false);
  }

  goToPage(p: number | '...'): void {
    if (p === '...') return;
    this.currentPage.set(Math.max(1, Math.min(p, this.totalPagesComputed())));
  }

  setPageSize(size: number): void { this.pageSize.set(size); this.currentPage.set(1); }

  get pageTitle(): string {
    const map: Record<SubPage, string> = { 'areas': 'Areas', 'area-groups': 'Area Groups', 'packages': 'Packages', 'service-groups': 'Service Groups', 'services': 'Services', 'product-groups': 'Product Groups', 'products': 'Products', 'suppliers': 'Suppliers' };
    return map[this.activePage()];
  }

  get addLabel(): string {
    const t = this.pageTitle;
    if (t.endsWith('ies')) return 'Add ' + t.slice(0, -3) + 'y';
    if (t.endsWith('s')) return 'Add ' + t.slice(0, -1);
    return 'Add ' + t;
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────
  openAdd(): void { this.modalMode.set('add'); this.editingId.set(null); this.resetForms(); this.showModal.set(true); }

  openEdit(item: Area | AreaGroup | Package | ServiceGroup | Service | ProductGroup | Product | Supplier): void {
    this.modalMode.set('edit'); this.editingId.set(item.id);
    const p = this.activePage();
    if (p === 'areas') this.areaForm.set({ ...(item as Area) });
    else if (p === 'area-groups') this.areaGroupForm.set({ ...(item as AreaGroup) });
    else if (p === 'packages') this.packageForm.set({ ...(item as Package) });
    else if (p === 'service-groups') this.serviceGroupForm.set({ ...(item as ServiceGroup) });
    else if (p === 'services') this.serviceForm.set({ ...(item as Service) });
    else if (p === 'product-groups') this.productGroupForm.set({ ...(item as ProductGroup) });
    else if (p === 'products') this.productForm.set({ ...(item as Product) });
    else if (p === 'suppliers') this.supplierForm.set({ ...(item as Supplier) });
    this.showModal.set(true);
  }

  save(): void {
    const p = this.activePage(); const mode = this.modalMode();
    if (p === 'areas') {
      const f = this.areaForm(); if (!f.description) return;
      const newId = Math.max(0, ...this.areas().map(a => a.id)) + 1;
      if (mode === 'add') this.areas.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('A', newId), description: f.description!, maxCapacity: f.maxCapacity ?? 1, forGroup: f.forGroup ?? false, sharedByEmployee: f.sharedByEmployee ?? true, active: f.active ?? true, order: newId, availableOnline: f.availableOnline ?? true, groupId: f.groupId }]);
      else this.areas.update(l => l.map(a => a.id === this.editingId() ? { ...a, ...f } as Area : a));
    } else if (p === 'area-groups') {
      const f = this.areaGroupForm(); if (!f.description) return;
      const newId = Math.max(0, ...this.areaGroups().map(g => g.id)) + 1;
      if (mode === 'add') this.areaGroups.update(l => [...l, { id: newId, description: f.description! }]);
      else this.areaGroups.update(l => l.map(g => g.id === this.editingId() ? { ...g, ...f } as AreaGroup : g));
    } else if (p === 'packages') {
      const f = this.packageForm(); if (!f.shortDescription) return;
      const newId = Math.max(0, ...this.packages().map(x => x.id)) + 1;
      if (mode === 'add') this.packages.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('PKG', newId), shortDescription: f.shortDescription!, longDescription: f.longDescription ?? '', category: f.category ?? 'Combosale Open', durationType: f.durationType ?? 'Years', duration: f.duration ?? 1, services: f.services ?? 0, active: f.active ?? true }]);
      else this.packages.update(l => l.map(x => x.id === this.editingId() ? { ...x, ...f } as Package : x));
    } else if (p === 'service-groups') {
      const f = this.serviceGroupForm(); if (!f.description) return;
      const newId = Math.max(0, ...this.serviceGroups().map(g => g.id)) + 1;
      if (mode === 'add') this.serviceGroups.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('SG', newId), description: f.description!, active: f.active ?? true, order: f.order ?? newId }]);
      else this.serviceGroups.update(l => l.map(g => g.id === this.editingId() ? { ...g, ...f } as ServiceGroup : g));
    } else if (p === 'services') {
      const f = this.serviceForm(); if (!f.name) return;
      const grp = this.serviceGroups().find(g => g.id === f.groupId);
      const newId = Math.max(0, ...this.services().map(s => s.id)) + 1;
      if (mode === 'add') this.services.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('SVC', newId), name: f.name!, description: f.description ?? '', groupId: f.groupId ?? 1, groupName: grp?.description ?? '', duration: f.duration ?? 60, price: f.price ?? 0, status: f.status ?? 'Active', type: f.type ?? 'Therapy', barcode: f.barcode ?? this.autoBarcode(newId), active: f.active ?? true, availableOnline: f.availableOnline ?? true }]);
      else this.services.update(l => l.map(s => s.id === this.editingId() ? { ...s, ...f, groupName: grp?.description ?? s.groupName } as Service : s));
    } else if (p === 'product-groups') {
      const f = this.productGroupForm(); if (!f.description) return;
      const newId = Math.max(0, ...this.productGroups().map(g => g.id)) + 1;
      if (mode === 'add') this.productGroups.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('PG', newId), description: f.description!, active: f.active ?? true }]);
      else this.productGroups.update(l => l.map(g => g.id === this.editingId() ? { ...g, ...f } as ProductGroup : g));
    } else if (p === 'products') {
      const f = this.productForm(); if (!f.name) return;
      const grp = this.productGroups().find(g => g.id === f.groupId);
      const newId = Math.max(0, ...this.products().map(x => x.id)) + 1;
      if (mode === 'add') this.products.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('PRD', newId), name: f.name!, description: f.description ?? '', groupId: f.groupId ?? 1, groupName: grp?.description ?? '', price: f.price ?? 0, status: f.status ?? 'Active', barcode: f.barcode ?? this.autoBarcode(newId + 100), active: f.active ?? true }]);
      else this.products.update(l => l.map(x => x.id === this.editingId() ? { ...x, ...f, groupName: grp?.description ?? x.groupName } as Product : x));
    } else if (p === 'suppliers') {
      const f = this.supplierForm(); if (!f.name) return;
      const newId = Math.max(0, ...this.suppliers().map(s => s.id)) + 1;
      if (mode === 'add') this.suppliers.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('SUP', newId), name: f.name!, contactPerson: f.contactPerson ?? '', email: f.email ?? '', phone: f.phone ?? '', address: f.address ?? '', active: f.active ?? true }]);
      else this.suppliers.update(l => l.map(s => s.id === this.editingId() ? { ...s, ...f } as Supplier : s));
    }
    this.showModal.set(false);
  }

  deleteItem(id: number): void {
    if (!confirm('Delete this item?')) return;
    const p = this.activePage();
    if (p === 'areas') this.areas.update(l => l.filter(a => a.id !== id));
    else if (p === 'area-groups') this.areaGroups.update(l => l.filter(g => g.id !== id));
    else if (p === 'packages') this.packages.update(l => l.filter(x => x.id !== id));
    else if (p === 'service-groups') this.serviceGroups.update(l => l.filter(g => g.id !== id));
    else if (p === 'services') this.services.update(l => l.filter(s => s.id !== id));
    else if (p === 'product-groups') this.productGroups.update(l => l.filter(g => g.id !== id));
    else if (p === 'products') this.products.update(l => l.filter(x => x.id !== id));
    else if (p === 'suppliers') this.suppliers.update(l => l.filter(s => s.id !== id));
  }

  toggleActive(id: number): void {
    const p = this.activePage();
    if (p === 'areas') this.areas.update(l => l.map(a => a.id === id ? { ...a, active: !a.active } : a));
    else if (p === 'packages') this.packages.update(l => l.map(x => x.id === id ? { ...x, active: !x.active } : x));
    else if (p === 'service-groups') this.serviceGroups.update(l => l.map(g => g.id === id ? { ...g, active: !g.active } : g));
    else if (p === 'services') this.services.update(l => l.map(s => s.id === id ? { ...s, active: !s.active } : s));
    else if (p === 'product-groups') this.productGroups.update(l => l.map(g => g.id === id ? { ...g, active: !g.active } : g));
    else if (p === 'products') this.products.update(l => l.map(x => x.id === id ? { ...x, active: !x.active } : x));
    else if (p === 'suppliers') this.suppliers.update(l => l.map(s => s.id === id ? { ...s, active: !s.active } : s));
  }

  private resetForms(): void {
    this.areaForm.set({ active: true, sharedByEmployee: true, availableOnline: true, forGroup: false, maxCapacity: 1 });
    this.areaGroupForm.set({});
    this.packageForm.set({ active: true, durationType: 'Years', duration: 1, services: 0, category: 'Combosale Open' });
    this.serviceGroupForm.set({ active: true, order: 1 });
    this.serviceForm.set({ active: true, availableOnline: true, duration: 60, price: 0, groupId: 1, status: 'Active', type: 'Therapy' });
    this.productGroupForm.set({ active: true });
    this.productForm.set({ active: true, price: 0, groupId: 1, status: 'Active' });
    this.supplierForm.set({ active: true });
  }

  private autoCode(prefix: string, id: number): string { return `${prefix}${String(id).padStart(3, '0')}`; }
  private autoBarcode(id: number): string { return `890123456${String(id).padStart(4, '0')}`; }

  getAreaGroupName(groupId?: number): string { return this.areaGroups().find(g => g.id === groupId)?.description ?? '—'; }
  getProductGroupName(groupId?: number): string { return this.productGroups().find(g => g.id === groupId)?.description ?? '—'; }
  isNumber(val: number | '...'): val is number { return val !== '...'; }

  readonly serviceTypes = ['Therapy', 'Treatment', 'Beauty', 'Package', 'Consultation', 'Other'];
  readonly statusOptions = ['Active', 'Inactive', 'Draft'];
}
