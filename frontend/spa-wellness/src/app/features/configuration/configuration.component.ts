import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionnaireService } from './questionnaire.service';

// ─── Models ───────────────────────────────────────────────────────────────────
export interface Area { id: number; code: string; description: string; maxCapacity: number; forGroup: boolean; sharedByEmployee: boolean; active: boolean; order: number; availableOnline: boolean; groupId?: number; }
export interface AreaGroup { id: number; description: string; }
export interface Package { id: number; code: string; shortDescription: string; longDescription: string; category: string; durationType: string; duration: number; services: number; active: boolean; }
export interface ServiceGroup { id: number; code: string; description: string; active: boolean; order: number; }
export interface Service { id: number; code: string; name: string; shortDescription: string; longDescription: string; onlineShortDescription: string; onlineLongDescription: string; description: string; groupId: number; groupName: string; duration: number; downTime: number; price: number; status: string; onlineStatus: string; type: string; barcode: string; active: boolean; availableOnline: boolean; imageUrl: string; includedInPackage: boolean; pricingId?: number; }
export interface ProductGroup { id: number; code: string; description: string; active: boolean; }
export interface Product { id: number; code: string; name: string; shortDescription: string; longDescription: string; description: string; groupId: number; groupName: string; price: number; status: string; barcode: string; active: boolean; availableOnline: boolean; imageUrl: string; pricingId?: number; }

export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'number' | 'date' | 'yesno';
export interface QuestionOption { id: number; label: string; }
export interface Question { id: number; label: string; type: QuestionType; required: boolean; options: QuestionOption[]; placeholder: string; order: number; }
export interface QuestionGroup { id: number; title: string; type: 'Profile' | 'Question'; order: number; questions: Question[]; }
export interface Questionnaire {
  id: number; referenceToken: string; description: string; status: 'Active' | 'Inactive' | 'Draft';
  updateCustomerInfo: boolean; activeFrom: string; activeTo: string; answersValidDays: number;
  groups: QuestionGroup[];
}
export interface Supplier { id: number; code: string; name: string; contactPerson: string; email: string; phone: string; address: string; active: boolean; }
export interface Pricing { id: number; code: string; shortDescription: string; longDescription: string; category: string; active: boolean; availableOnline: boolean; }

export type MembershipTier = 'basic' | 'premium' | 'vip' | 'corporate';
export type BillingCycle = 'monthly' | 'quarterly' | 'annual' | 'lifetime';
export interface MembershipBenefit { id: number; description: string; }
export interface MembershipPlanConfig {
  id: number; code: string; name: string; tier: MembershipTier;
  price: number; billingCycle: BillingCycle; duration: number; durationUnit: 'days' | 'months' | 'years';
  discountPercentage: number; freeServicesPerMonth: number; priorityBooking: boolean;
  onlineSignup: boolean; accessCardEnabled: boolean; accessCardType: string;
  autoRenew: boolean; trialDays: number; maxMembers: number;
  benefits: MembershipBenefit[]; status: 'Active' | 'Inactive' | 'Draft';
  renewalCount: number; activeMembers: number; createdAt: string;
}

export type SubPage = 'areas' | 'area-groups' | 'packages' | 'service-groups' | 'services' | 'product-groups' | 'products' | 'suppliers' | 'pricings' | 'questionnaires' | 'memberships' | 'employees' | 'customers';

export type EmployeeRole = 'therapist' | 'receptionist' | 'manager' | 'cashier' | 'cleaner' | 'other';
export interface Employee {
  id: number; code: string; firstName: string; lastName: string; role: EmployeeRole;
  email: string; phone: string; specialties: string[]; status: 'Active' | 'Inactive' | 'On Leave';
  hireDate: string; birthDate: string; gender: 'Male' | 'Female' | 'Other';
  address: string; emergencyContact: string; notes: string;
}

export type CustomerType = 'individual' | 'group';
export type Salutation = 'Mr.' | 'Mrs.' | 'Ms.' | 'Dr.' | 'Prof.' | 'Other';
export interface CustomerQuestionnaire { questionnaireId: number; questionnaireName: string; completedAt: string; }
export interface Customer {
  id: number; code: string; salutation: Salutation; firstName: string; lastName: string;
  type: CustomerType; gender: 'Male' | 'Female' | 'Other'; nationality: string;
  birthDate: string; email: string; contactEmail: string; phone: string; telephone: string;
  address: string; membershipId?: number; tags: string[]; notes: string;
  questionnaires: CustomerQuestionnaire[]; status: 'Active' | 'Inactive'; createdAt: string;
}

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent implements OnInit {
  activePage = signal<SubPage>('areas');

  readonly subNavItems: { page: SubPage; label: string; icon: string }[] = [
    { page: 'areas', label: 'Areas', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
    { page: 'area-groups', label: 'Area Groups', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M3 14h18"/><circle cx="12" cy="19" r="2"/></svg>' },
    { page: 'packages', label: 'Packages', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' },
    { page: 'services', label: 'Services', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
    { page: 'service-groups', label: 'Service Groups', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' },
    { page: 'products', label: 'Products', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>' },
    { page: 'product-groups', label: 'Product Groups', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' },
    { page: 'suppliers', label: 'Suppliers', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
    { page: 'questionnaires', label: 'Questionnaires', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="13" r="1"/><path d="M10 17s1 1 4 0"/></svg>' },
    { page: 'memberships', label: 'Memberships', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M7 15h.01M11 15h2"/></svg>' },
    { page: 'employees', label: 'Employees', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
    { page: 'customers', label: 'Customers', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
    { page: 'pricings', label: 'Pricings', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
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
    { id: 1, code: 'SWE60', name: 'Swedish Massage', shortDescription: 'A gentle full-body massage', longDescription: 'A classic full-body massage using long, flowing strokes to relax muscles and improve circulation.', onlineShortDescription: 'Relax with our signature Swedish Massage', onlineLongDescription: 'Experience the ultimate relaxation with our 60-minute Swedish Massage, designed to melt away tension.', description: 'A gentle full-body massage', groupId: 1, groupName: 'Massage Therapies', duration: 60, downTime: 10, price: 120, status: 'Active', onlineStatus: 'Online', type: 'Therapy', barcode: '8901234560001', active: true, availableOnline: true, imageUrl: '', includedInPackage: true, pricingId: 1 },
    { id: 2, code: 'DTP75', name: 'Deep Tissue Massage', shortDescription: 'Targets deep muscle layers', longDescription: 'Intense massage targeting deep layers of muscle tissue for chronic pain relief.', onlineShortDescription: 'Deep relief for chronic tension', onlineLongDescription: 'Our Deep Tissue Massage reaches the deeper layers of muscle to release chronic tension and pain.', description: 'Targets deep muscle layers', groupId: 1, groupName: 'Massage Therapies', duration: 75, downTime: 10, price: 150, status: 'Active', onlineStatus: 'Online', type: 'Therapy', barcode: '8901234560002', active: true, availableOnline: true, imageUrl: '', includedInPackage: true, pricingId: 1 },
    { id: 3, code: 'HST90', name: 'Hot Stone Therapy', shortDescription: 'Heated stones for tension relief', longDescription: 'Heated basalt stones placed on key points to ease tension and improve energy flow.', onlineShortDescription: 'Melt away stress with heated stones', onlineLongDescription: 'Warm volcanic stones combined with massage techniques to deeply relax muscles and restore balance.', description: 'Heated stones for tension relief', groupId: 1, groupName: 'Massage Therapies', duration: 90, downTime: 15, price: 180, status: 'Active', onlineStatus: 'Online', type: 'Therapy', barcode: '8901234560003', active: true, availableOnline: true, imageUrl: '', includedInPackage: true, pricingId: 2 },
    { id: 4, code: 'ARO60', name: 'Aromatherapy Massage', shortDescription: 'Essential oil massage', longDescription: 'Essential oil-infused massage to promote relaxation and well-being.', onlineShortDescription: 'Soothe your senses with aromatherapy', onlineLongDescription: 'A blissful combination of therapeutic massage and carefully selected essential oils.', description: 'Essential oil massage', groupId: 1, groupName: 'Massage Therapies', duration: 60, downTime: 10, price: 135, status: 'Active', onlineStatus: 'Online', type: 'Therapy', barcode: '8901234560004', active: true, availableOnline: true, imageUrl: '', includedInPackage: false, pricingId: 1 },
    { id: 5, code: 'HYD45', name: 'Hydrating Facial', shortDescription: 'Deep moisturizing facial', longDescription: 'Deep moisturizing facial treatment for dry and dehydrated skin.', onlineShortDescription: 'Restore your skin\'s natural glow', onlineLongDescription: 'Our Hydrating Facial uses premium serums and masks to deeply nourish and revitalize your skin.', description: 'Deep moisturizing facial', groupId: 2, groupName: 'Facial Treatments', duration: 45, downTime: 5, price: 95, status: 'Active', onlineStatus: 'Online', type: 'Treatment', barcode: '8901234560005', active: true, availableOnline: true, imageUrl: '', includedInPackage: true, pricingId: 1 },
    { id: 6, code: 'AAF60', name: 'Anti-Aging Facial', shortDescription: 'Reduces fine lines', longDescription: 'Advanced facial treatment to reduce fine lines and improve skin elasticity.', onlineShortDescription: 'Turn back the clock with our anti-aging facial', onlineLongDescription: 'A powerful anti-aging treatment combining advanced techniques to visibly reduce fine lines.', description: 'Reduces fine lines', groupId: 2, groupName: 'Facial Treatments', duration: 60, downTime: 5, price: 145, status: 'Active', onlineStatus: 'Online', type: 'Treatment', barcode: '8901234560006', active: true, availableOnline: true, imageUrl: '', includedInPackage: false, pricingId: 2 },
    { id: 7, code: 'BWR75', name: 'Body Wrap', shortDescription: 'Detoxifying body wrap', longDescription: 'Detoxifying body wrap using natural minerals and herbs.', onlineShortDescription: 'Detox and renew with our body wrap', onlineLongDescription: 'A luxurious full-body wrap that draws out impurities and leaves skin silky smooth.', description: 'Detoxifying body wrap', groupId: 3, groupName: 'Body Treatments', duration: 75, downTime: 15, price: 160, status: 'Active', onlineStatus: 'Offline', type: 'Treatment', barcode: '8901234560007', active: true, availableOnline: false, imageUrl: '', includedInPackage: true, pricingId: 1 },
    { id: 8, code: 'SSE45', name: 'Salt Scrub Exfoliation', shortDescription: 'Full-body exfoliation', longDescription: 'Full-body exfoliation with mineral-rich sea salt to reveal glowing skin.', onlineShortDescription: 'Reveal radiant skin with salt scrub', onlineLongDescription: 'Our invigorating salt scrub removes dead skin cells and stimulates circulation for a healthy glow.', description: 'Full-body exfoliation', groupId: 3, groupName: 'Body Treatments', duration: 45, downTime: 10, price: 85, status: 'Active', onlineStatus: 'Online', type: 'Treatment', barcode: '8901234560008', active: true, availableOnline: true, imageUrl: '', includedInPackage: true, pricingId: 1 },
    { id: 9, code: 'GEL45', name: 'Gel Manicure', shortDescription: 'Long-lasting gel manicure', longDescription: 'Long-lasting gel manicure with cuticle care and hand massage.', onlineShortDescription: 'Perfect nails that last', onlineLongDescription: 'Our gel manicure provides a flawless, chip-resistant finish that lasts up to 3 weeks.', description: 'Long-lasting gel manicure', groupId: 4, groupName: 'Nail Services', duration: 45, downTime: 5, price: 55, status: 'Active', onlineStatus: 'Online', type: 'Beauty', barcode: '8901234560009', active: true, availableOnline: true, imageUrl: '', includedInPackage: false, pricingId: 1 },
    { id: 10, code: 'LUX60', name: 'Luxury Pedicure', shortDescription: 'Full pedicure treatment', longDescription: 'Full pedicure with foot soak, exfoliation, and massage.', onlineShortDescription: 'Pamper your feet with luxury', onlineLongDescription: 'A complete pedicure experience including soak, scrub, massage, and polish for perfectly groomed feet.', description: 'Full pedicure treatment', groupId: 4, groupName: 'Nail Services', duration: 60, downTime: 5, price: 75, status: 'Active', onlineStatus: 'Online', type: 'Beauty', barcode: '8901234560010', active: true, availableOnline: true, imageUrl: '', includedInPackage: false, pricingId: 1 },
    { id: 11, code: 'HST60', name: 'Hair Styling', shortDescription: 'Wash, cut and blow dry', longDescription: 'Professional hair styling including wash, cut, and blow dry.', onlineShortDescription: 'Transform your look', onlineLongDescription: 'Our expert stylists will create the perfect look for you with a wash, cut, and professional blow dry.', description: 'Wash, cut and blow dry', groupId: 5, groupName: 'Hair Services', duration: 60, downTime: 10, price: 90, status: 'Active', onlineStatus: 'Offline', type: 'Beauty', barcode: '8901234560011', active: true, availableOnline: false, imageUrl: '', includedInPackage: false, pricingId: 1 },
    { id: 12, code: 'WPK180', name: 'Wellness Package', shortDescription: 'Complete day package', longDescription: 'Complete day package: massage, facial, and body treatment.', onlineShortDescription: 'The ultimate wellness day', onlineLongDescription: 'Indulge in a full day of pampering with our signature wellness package including massage, facial, and body treatment.', description: 'Complete day package', groupId: 6, groupName: 'Wellness Packages', duration: 180, downTime: 20, price: 350, status: 'Active', onlineStatus: 'Online', type: 'Package', barcode: '8901234560012', active: true, availableOnline: true, imageUrl: '', includedInPackage: false, pricingId: 2 },
  ]);

  productGroups = signal<ProductGroup[]>([
    { id: 1, code: 'SKN', description: 'Skincare', active: true },
    { id: 2, code: 'ARO', description: 'Aromatherapy', active: true },
    { id: 3, code: 'HAR', description: 'Hair Care', active: true },
    { id: 4, code: 'SLP', description: 'Sleep & Wellness', active: true },
    { id: 5, code: 'NAL', description: 'Nail Care', active: true },
  ]);

  products = signal<Product[]>([
    { id: 1, code: 'SKN001', name: 'Hydrating Face Cream', shortDescription: 'Deep moisturizing cream', longDescription: 'Deep moisturizing cream for all skin types, enriched with hyaluronic acid.', description: 'Deep moisturizing cream for all skin types', groupId: 1, groupName: 'Skincare', price: 45, status: 'Active', barcode: '8100469863630', active: true, availableOnline: true, imageUrl: '', pricingId: 1 },
    { id: 2, code: 'SKN002', name: 'Anti-Aging Serum', shortDescription: 'Reduces fine lines', longDescription: 'Advanced serum that reduces fine lines and wrinkles with retinol complex.', description: 'Reduces fine lines and wrinkles', groupId: 1, groupName: 'Skincare', price: 85, status: 'Active', barcode: '8100469863631', active: true, availableOnline: true, imageUrl: '', pricingId: 1 },
    { id: 3, code: 'ARO001', name: 'Lavender Essential Oil', shortDescription: 'Pure lavender oil', longDescription: 'Pure therapeutic-grade lavender essential oil for relaxation and sleep.', description: 'Pure lavender oil for relaxation', groupId: 2, groupName: 'Aromatherapy', price: 28, status: 'Active', barcode: '8100469863632', active: true, availableOnline: true, imageUrl: '', pricingId: 1 },
    { id: 4, code: 'ARO002', name: 'Eucalyptus Oil', shortDescription: 'Refreshing eucalyptus oil', longDescription: 'Refreshing eucalyptus essential oil for respiratory wellness and invigoration.', description: 'Refreshing eucalyptus essential oil', groupId: 2, groupName: 'Aromatherapy', price: 24, status: 'Active', barcode: '8100469863633', active: true, availableOnline: false, imageUrl: '', pricingId: 1 },
    { id: 5, code: 'HAR001', name: 'Nourishing Hair Mask', shortDescription: 'Deep conditioning mask', longDescription: 'Intensive deep conditioning hair treatment with argan oil and keratin.', description: 'Deep conditioning hair treatment', groupId: 3, groupName: 'Hair Care', price: 32, status: 'Active', barcode: '8100469863634', active: true, availableOnline: true, imageUrl: '', pricingId: 2 },
    { id: 6, code: 'SLP001', name: 'Sleep Pillow Mist', shortDescription: 'Calming sleep mist', longDescription: 'Calming lavender and chamomile mist for better sleep quality.', description: 'Calming mist for better sleep', groupId: 4, groupName: 'Sleep & Wellness', price: 22, status: 'Active', barcode: '8100469863635', active: true, availableOnline: true, imageUrl: '', pricingId: 1 },
    { id: 7, code: 'NAL001', name: 'Cuticle Oil', shortDescription: 'Nourishing cuticle oil', longDescription: 'Vitamin E enriched cuticle oil for healthy, hydrated nails and cuticles.', description: 'Nourishing cuticle treatment oil', groupId: 5, groupName: 'Nail Care', price: 15, status: 'Active', barcode: '8100469863636', active: true, availableOnline: true, imageUrl: '', pricingId: 1 },
    { id: 8, code: 'SKN003', name: 'Body Scrub', shortDescription: 'Exfoliating sea salt scrub', longDescription: 'Mineral-rich sea salt body scrub with coconut oil for silky smooth skin.', description: 'Exfoliating sea salt body scrub', groupId: 1, groupName: 'Skincare', price: 38, status: 'Active', barcode: '8100469863637', active: true, availableOnline: false, imageUrl: '', pricingId: 1 },
  ]);

  pricings = signal<Pricing[]>([
    { id: 1, code: 'OFF', shortDescription: 'Official', longDescription: 'Official standard pricing for all services and products', category: 'Normal', active: true, availableOnline: true },
    { id: 2, code: 'MSN', shortDescription: 'Maison', longDescription: 'Maison premium pricing tier for VIP clients', category: 'Maison', active: true, availableOnline: false },
    { id: 3, code: 'MBR', shortDescription: 'Member Rate', longDescription: 'Discounted pricing for active membership holders', category: 'Membership', active: true, availableOnline: true },
    { id: 4, code: 'RMC', shortDescription: 'Room Charge', longDescription: 'Pricing for services charged directly to hotel room', category: 'Room Charge', active: true, availableOnline: false },
    { id: 5, code: 'CRD', shortDescription: 'Credit Card', longDescription: 'Standard credit card payment pricing', category: 'Credit Card', active: true, availableOnline: true },
    { id: 6, code: 'CSH', shortDescription: 'Cash', longDescription: 'Cash payment pricing', category: 'Cash', active: true, availableOnline: false },
  ]);

  suppliers = signal<Supplier[]>([
    { id: 1, code: 'SUP001', name: 'Natura Essentials Ltd', contactPerson: 'Maria Santos', email: 'maria@naturaessentials.com', phone: '+1-555-0401', address: '12 Green Lane, New York, NY 10001', active: true },
    { id: 2, code: 'SUP002', name: 'Aromatherapy World', contactPerson: 'James Chen', email: 'james@aromatherapyworld.com', phone: '+1-555-0402', address: '45 Blossom Ave, Los Angeles, CA 90001', active: true },
    { id: 3, code: 'SUP003', name: 'Pure Wellness Co.', contactPerson: 'Sarah Williams', email: 'sarah@purewellness.com', phone: '+1-555-0403', address: '78 Spa Road, Miami, FL 33101', active: true },
    { id: 4, code: 'SUP004', name: 'Luxury Beauty Supply', contactPerson: 'David Park', email: 'david@luxurybeauty.com', phone: '+1-555-0404', address: '99 Glamour St, Chicago, IL 60601', active: false },
    { id: 5, code: 'SUP005', name: 'Organic Spa Imports', contactPerson: 'Emma Wilson', email: 'emma@organicspa.com', phone: '+1-555-0405', address: '33 Natural Way, Seattle, WA 98101', active: true },
  ]);

  membershipPlans = signal<MembershipPlanConfig[]>([
    { id: 1, code: 'ESS', name: 'Essentials', tier: 'basic', price: 49, billingCycle: 'monthly', duration: 1, durationUnit: 'months', discountPercentage: 10, freeServicesPerMonth: 1, priorityBooking: false, onlineSignup: true, accessCardEnabled: true, accessCardType: 'RFID', autoRenew: true, trialDays: 7, maxMembers: 0, benefits: [{ id: 1, description: '10% off all services' }, { id: 2, description: '1 free service/month' }, { id: 3, description: 'Birthday discount' }], status: 'Active', renewalCount: 48, activeMembers: 124, createdAt: '2023-01-01' },
    { id: 2, code: 'PRE', name: 'Premium Bliss', tier: 'premium', price: 99, billingCycle: 'monthly', duration: 1, durationUnit: 'months', discountPercentage: 20, freeServicesPerMonth: 3, priorityBooking: true, onlineSignup: true, accessCardEnabled: true, accessCardType: 'NFC', autoRenew: true, trialDays: 14, maxMembers: 0, benefits: [{ id: 1, description: '20% off all services' }, { id: 2, description: '3 free services/month' }, { id: 3, description: 'Priority booking' }, { id: 4, description: 'Free product samples' }], status: 'Active', renewalCount: 112, activeMembers: 87, createdAt: '2023-01-01' },
    { id: 3, code: 'VIP', name: 'VIP Serenity', tier: 'vip', price: 199, billingCycle: 'monthly', duration: 1, durationUnit: 'months', discountPercentage: 30, freeServicesPerMonth: 99, priorityBooking: true, onlineSignup: false, accessCardEnabled: true, accessCardType: 'Smart Card', autoRenew: true, trialDays: 0, maxMembers: 50, benefits: [{ id: 1, description: '30% off all services' }, { id: 2, description: 'Unlimited services' }, { id: 3, description: 'VIP priority booking' }, { id: 4, description: 'Quarterly free products' }, { id: 5, description: 'Exclusive events access' }], status: 'Active', renewalCount: 34, activeMembers: 23, createdAt: '2023-06-01' },
    { id: 4, code: 'CRP', name: 'Corporate Wellness', tier: 'corporate', price: 499, billingCycle: 'annual', duration: 1, durationUnit: 'years', discountPercentage: 25, freeServicesPerMonth: 10, priorityBooking: true, onlineSignup: false, accessCardEnabled: true, accessCardType: 'RFID', autoRenew: false, trialDays: 30, maxMembers: 20, benefits: [{ id: 1, description: '25% off all services' }, { id: 2, description: '10 services/month per member' }, { id: 3, description: 'Dedicated account manager' }, { id: 4, description: 'Monthly wellness reports' }], status: 'Active', renewalCount: 8, activeMembers: 15, createdAt: '2024-01-01' },
  ]);

  membershipForm = signal<Partial<MembershipPlanConfig>>({});
  newBenefit = signal('');

  readonly tierOptions: MembershipTier[] = ['basic', 'premium', 'vip', 'corporate'];
  readonly billingCycleOptions: BillingCycle[] = ['monthly', 'quarterly', 'annual', 'lifetime'];
  readonly accessCardTypes = ['RFID', 'NFC', 'Smart Card', 'Barcode', 'QR Code', 'None'];

  filteredMemberships = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return this.membershipPlans().filter(m => !q || m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || m.tier.includes(q));
  });
  paginatedMemberships = computed(() => this.paginate(this.filteredMemberships()));

  addBenefit(): void {
    const label = this.newBenefit().trim(); if (!label) return;
    const benefits = this.membershipForm().benefits ?? [];
    const newId = Math.max(0, ...benefits.map(b => b.id)) + 1;
    this.membershipForm.update(f => ({ ...f, benefits: [...(f.benefits ?? []), { id: newId, description: label }] }));
    this.newBenefit.set('');
  }

  removeBenefit(id: number): void {
    this.membershipForm.update(f => ({ ...f, benefits: (f.benefits ?? []).filter(b => b.id !== id) }));
  }

  tierColor(tier: MembershipTier): string {
    const map: Record<MembershipTier, string> = { basic: '#6b7280', premium: '#3b82f6', vip: '#8b5cf6', corporate: '#f59e0b' };
    return map[tier];
  }


  // ─── Employees ────────────────────────────────────────────────────────────
  employees = signal<Employee[]>([
    { id: 1, code: 'EMP001', firstName: 'Emma', lastName: 'Wilson', role: 'therapist', email: 'emma@serenity.com', phone: '+1-555-0201', specialties: ['Massage', 'Body Treatment'], status: 'Active', hireDate: '2022-03-15', birthDate: '1990-06-12', gender: 'Female', address: '12 Spa Lane, New York', emergencyContact: 'John Wilson +1-555-9901', notes: 'Senior therapist.' },
    { id: 2, code: 'EMP002', firstName: 'Olivia', lastName: 'Martinez', role: 'therapist', email: 'olivia@serenity.com', phone: '+1-555-0202', specialties: ['Facial', 'Body Treatment'], status: 'Active', hireDate: '2022-06-01', birthDate: '1993-02-28', gender: 'Female', address: '45 Wellness Ave, New York', emergencyContact: 'Carlos Martinez +1-555-9902', notes: '' },
    { id: 3, code: 'EMP003', firstName: 'Sophia', lastName: 'Kim', role: 'therapist', email: 'sophia@serenity.com', phone: '+1-555-0203', specialties: ['Massage', 'Wellness'], status: 'On Leave', hireDate: '2021-11-10', birthDate: '1988-09-05', gender: 'Female', address: '78 Calm Street, New York', emergencyContact: 'Min Kim +1-555-9903', notes: 'On leave.' },
    { id: 4, code: 'EMP004', firstName: 'Isabella', lastName: 'Davis', role: 'therapist', email: 'isabella@serenity.com', phone: '+1-555-0204', specialties: ['Nail', 'Hair'], status: 'Active', hireDate: '2023-01-20', birthDate: '1995-11-17', gender: 'Female', address: '33 Beauty Blvd, New York', emergencyContact: 'Tom Davis +1-555-9904', notes: '' },
    { id: 5, code: 'EMP005', firstName: 'Mia', lastName: 'Johnson', role: 'therapist', email: 'mia@serenity.com', phone: '+1-555-0205', specialties: ['Massage', 'Facial', 'Wellness'], status: 'Active', hireDate: '2023-05-08', birthDate: '1997-04-22', gender: 'Female', address: '90 Relax Road, New York', emergencyContact: 'Sara Johnson +1-555-9905', notes: '' },
    { id: 6, code: 'EMP006', firstName: 'James', lastName: 'Carter', role: 'receptionist', email: 'james@serenity.com', phone: '+1-555-0206', specialties: [], status: 'Active', hireDate: '2022-09-01', birthDate: '1991-07-30', gender: 'Male', address: '5 Front Desk Way, New York', emergencyContact: 'Linda Carter +1-555-9906', notes: '' },
    { id: 7, code: 'EMP007', firstName: 'Sarah', lastName: 'Lee', role: 'manager', email: 'sarah.lee@serenity.com', phone: '+1-555-0207', specialties: [], status: 'Active', hireDate: '2020-01-15', birthDate: '1985-03-14', gender: 'Female', address: '1 Management Ave, New York', emergencyContact: 'David Lee +1-555-9907', notes: 'Spa Manager.' },
  ]);

  employeeForm = signal<Partial<Employee>>({});
  readonly employeeRoles: EmployeeRole[] = ['therapist', 'receptionist', 'manager', 'cashier', 'cleaner', 'other'];
  readonly employeeStatuses = ['Active', 'Inactive', 'On Leave'];
  readonly specialtyOptions = ['Massage', 'Facial', 'Body Treatment', 'Nail', 'Hair', 'Wellness', 'Hydrotherapy', 'Aromatherapy'];

  filteredEmployees = computed(() => { const q = this.searchTerm().toLowerCase(); return this.employees().filter(e => !q || e.firstName.toLowerCase().includes(q) || e.lastName.toLowerCase().includes(q) || e.role.includes(q) || e.email.toLowerCase().includes(q)); });
  paginatedEmployees = computed(() => this.paginate(this.filteredEmployees()));

  // ─── Customers ────────────────────────────────────────────────────────────
  customers = signal<Customer[]>([
    { id: 1, code: 'CLT001', salutation: 'Mrs.', firstName: 'Alice', lastName: 'Thompson', type: 'individual', gender: 'Female', nationality: 'American', birthDate: '1985-04-12', email: 'alice@email.com', contactEmail: 'alice.work@email.com', phone: '+1-555-0301', telephone: '+1-555-0311', address: '12 Oak Street, New York', membershipId: 1, tags: ['VIP', 'Regular'], notes: 'Prefers Emma Wilson.', questionnaires: [{ questionnaireId: 1, questionnaireName: 'New Client Health Questionnaire', completedAt: '2024-01-15' }], status: 'Active', createdAt: '2023-01-10' },
    { id: 2, code: 'CLT002', salutation: 'Ms.', firstName: 'Jessica', lastName: 'Rivera', type: 'individual', gender: 'Female', nationality: 'American', birthDate: '1992-08-25', email: 'jessica@email.com', contactEmail: '', phone: '+1-555-0302', telephone: '', address: '45 Maple Ave, Los Angeles', tags: ['Regular'], notes: '', questionnaires: [{ questionnaireId: 2, questionnaireName: 'Facial Treatment Consultation', completedAt: '2024-02-10' }], status: 'Active', createdAt: '2023-06-15' },
    { id: 3, code: 'CLT003', salutation: 'Mr.', firstName: 'Michael', lastName: 'Chen', type: 'individual', gender: 'Male', nationality: 'Chinese', birthDate: '1988-11-03', email: 'michael@email.com', contactEmail: '', phone: '+1-555-0303', telephone: '+1-555-0313', address: '78 Pine Road, San Francisco', tags: ['New'], notes: 'First visit March 2024.', questionnaires: [], status: 'Active', createdAt: '2024-03-22' },
    { id: 4, code: 'CLT004', salutation: 'Mrs.', firstName: 'Sarah', lastName: 'Williams', type: 'individual', gender: 'Female', nationality: 'British', birthDate: '1979-06-18', email: 'sarah@email.com', contactEmail: 'sarah.biz@email.com', phone: '+1-555-0304', telephone: '+1-555-0314', address: '99 Elm Street, Miami', membershipId: 2, tags: ['Premium'], notes: 'Prefers Mia Johnson.', questionnaires: [{ questionnaireId: 1, questionnaireName: 'New Client Health Questionnaire', completedAt: '2023-09-01' }], status: 'Active', createdAt: '2022-09-01' },
    { id: 5, code: 'CLT005', salutation: 'Mr.', firstName: 'David', lastName: 'Park', type: 'individual', gender: 'Male', nationality: 'Korean', birthDate: '1990-02-14', email: 'david@email.com', contactEmail: '', phone: '+1-555-0305', telephone: '', address: '22 Cedar Lane, Chicago', tags: [], notes: '', questionnaires: [], status: 'Active', createdAt: '2023-11-20' },
    { id: 6, code: 'CLT006', salutation: 'Mrs.', firstName: 'Karen', lastName: 'Brown', type: 'individual', gender: 'Female', nationality: 'Canadian', birthDate: '1975-09-30', email: 'karen@email.com', contactEmail: 'karen.corp@email.com', phone: '+1-555-0306', telephone: '+1-555-0316', address: '55 Birch Blvd, Seattle', membershipId: 3, tags: ['VIP'], notes: 'VIP client.', questionnaires: [{ questionnaireId: 1, questionnaireName: 'New Client Health Questionnaire', completedAt: '2022-03-15' }], status: 'Active', createdAt: '2022-03-15' },
  ]);

  customerForm = signal<Partial<Customer>>({});
  readonly salutationOptions: Salutation[] = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Other'];
  readonly nationalityOptions = ['American', 'British', 'Canadian', 'Australian', 'French', 'German', 'Italian', 'Spanish', 'Chinese', 'Japanese', 'Korean', 'Indian', 'Brazilian', 'Mexican', 'Other'];

  filteredCustomers = computed(() => { const q = this.searchTerm().toLowerCase(); return this.customers().filter(c => !q || c.firstName.toLowerCase().includes(q) || c.lastName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)); });
  paginatedCustomers = computed(() => this.paginate(this.filteredCustomers()));

  getCustomerFullName(c: Customer): string { return `${c.salutation} ${c.firstName} ${c.lastName}`; }
  getMembershipName(id?: number): string { return id ? (this.membershipPlans().find(m => m.id === id)?.name ?? '—') : '—'; }

  toggleCustomerQuestionnaire(qId: number, qName: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current = this.customerForm().questionnaires ?? [];
    if (checked) {
      this.customerForm.update(f => ({ ...f, questionnaires: [...current, { questionnaireId: qId, questionnaireName: qName, completedAt: '' }] }));
    } else {
      this.customerForm.update(f => ({ ...f, questionnaires: current.filter(x => x.questionnaireId !== qId) }));
    }
  }

  constructor(private readonly router: Router, public readonly qService: QuestionnaireService, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    const page = this.route.snapshot.queryParamMap.get('page') as SubPage | null;
    if (page) this.activePage.set(page);
  }
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

  filteredPricings = computed(() => { const q = this.searchTerm().toLowerCase(); return this.pricings().filter(p => !q || p.shortDescription.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)); });

  paginatedAreas = computed(() => this.paginate(this.filteredAreas()));
  paginatedAreaGroups = computed(() => this.paginate(this.filteredAreaGroups()));
  paginatedPackages = computed(() => this.paginate(this.filteredPackages()));
  paginatedServiceGroups = computed(() => this.paginate(this.filteredServiceGroups()));
  paginatedServices = computed(() => this.paginate(this.filteredServices()));
  paginatedProductGroups = computed(() => this.paginate(this.filteredProductGroups()));
  paginatedProducts = computed(() => this.paginate(this.filteredProducts()));
  paginatedSuppliers = computed(() => this.paginate(this.filteredSuppliers()));
  paginatedPricings = computed(() => this.paginate(this.filteredPricings()));

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
      case 'pricings': return this.filteredPricings().length;
      case 'questionnaires': return this.filteredQuestionnaires().length;
      case 'memberships': return this.filteredMemberships().length;
      case 'employees': return this.filteredEmployees().length;
      case 'customers': return this.filteredCustomers().length;
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
  pricingForm = signal<Partial<Pricing>>({});

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
    const map: Record<SubPage, string> = { 'areas': 'Areas', 'area-groups': 'Area Groups', 'packages': 'Packages', 'service-groups': 'Service Groups', 'services': 'Services', 'product-groups': 'Product Groups', 'products': 'Products', 'suppliers': 'Suppliers', 'pricings': 'Pricings', 'questionnaires': 'Questionnaires', 'memberships': 'Membership Plans', 'employees': 'Employees', 'customers': 'Customers' };
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

  openEdit(item: Area | AreaGroup | Package | ServiceGroup | Service | ProductGroup | Product | Supplier | Pricing | MembershipPlanConfig | Employee | Customer): void {
    this.modalMode.set('edit'); this.editingId.set(item.id);
    const p = this.activePage();
    if (p === 'areas') this.areaForm.set({ ...(item as Area) });
    else if (p === 'area-groups') this.areaGroupForm.set({ ...(item as AreaGroup) });
    else if (p === 'packages') this.packageForm.set({ ...(item as Package) });
    else if (p === 'service-groups') this.serviceGroupForm.set({ ...(item as ServiceGroup) });
    else if (p === 'services') {
      const svc = item as Service;
      this.serviceForm.set({ ...svc, onlineStatus: svc.availableOnline ? 'Online' : 'Offline' });
    }
    else if (p === 'product-groups') this.productGroupForm.set({ ...(item as ProductGroup) });
    else if (p === 'products') this.productForm.set({ ...(item as Product) });
    else if (p === 'suppliers') this.supplierForm.set({ ...(item as Supplier) });
    else if (p === 'pricings') this.pricingForm.set({ ...(item as Pricing) });
    else if (p === 'memberships') { this.membershipForm.set({ ...(item as unknown as MembershipPlanConfig) }); this.newBenefit.set(''); }
    else if (p === 'employees') this.employeeForm.set({ ...(item as unknown as Employee) });
    else if (p === 'customers') this.customerForm.set({ ...(item as unknown as Customer) });
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
      if (mode === 'add') this.services.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('SVC', newId), name: f.name!, shortDescription: f.shortDescription ?? '', longDescription: f.longDescription ?? '', onlineShortDescription: f.onlineShortDescription ?? '', onlineLongDescription: f.onlineLongDescription ?? '', description: f.shortDescription ?? '', groupId: f.groupId ?? 1, groupName: grp?.description ?? '', duration: f.duration ?? 60, downTime: f.downTime ?? 0, price: f.price ?? 0, status: f.status ?? 'Active', onlineStatus: f.onlineStatus ?? 'Offline', type: f.type ?? 'Therapy', barcode: f.barcode ?? this.autoBarcode(newId), active: f.active ?? true, availableOnline: f.availableOnline ?? false, imageUrl: f.imageUrl ?? '', includedInPackage: f.includedInPackage ?? false, pricingId: f.pricingId }]);
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
      if (mode === 'add') this.products.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('PRD', newId), name: f.name!, shortDescription: f.shortDescription ?? '', longDescription: f.longDescription ?? '', description: f.description ?? '', groupId: f.groupId ?? 1, groupName: grp?.description ?? '', price: f.price ?? 0, status: f.status ?? 'Active', barcode: f.barcode ?? this.autoBarcode(newId + 100), active: f.active ?? true, availableOnline: f.availableOnline ?? false, imageUrl: f.imageUrl ?? '' }]);
      else this.products.update(l => l.map(x => x.id === this.editingId() ? { ...x, ...f, groupName: grp?.description ?? x.groupName } as Product : x));
    } else if (p === 'suppliers') {
      const f = this.supplierForm(); if (!f.name) return;
      const newId = Math.max(0, ...this.suppliers().map(s => s.id)) + 1;
      if (mode === 'add') this.suppliers.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('SUP', newId), name: f.name!, contactPerson: f.contactPerson ?? '', email: f.email ?? '', phone: f.phone ?? '', address: f.address ?? '', active: f.active ?? true }]);
      else this.suppliers.update(l => l.map(s => s.id === this.editingId() ? { ...s, ...f } as Supplier : s));
    } else if (p === 'pricings') {
      const f = this.pricingForm(); if (!f.shortDescription) return;
      const newId = Math.max(0, ...this.pricings().map(x => x.id)) + 1;
      if (mode === 'add') this.pricings.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('PRC', newId), shortDescription: f.shortDescription!, longDescription: f.longDescription ?? '', category: f.category ?? 'Normal', active: f.active ?? true, availableOnline: f.availableOnline ?? false }]);
      else this.pricings.update(l => l.map(x => x.id === this.editingId() ? { ...x, ...f } as Pricing : x));
    } else if (p === 'memberships') {
      const f = this.membershipForm(); if (!f.name) return;
      const newId = Math.max(0, ...this.membershipPlans().map(x => x.id)) + 1;
      if (mode === 'add') this.membershipPlans.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('MBR', newId), name: f.name!, tier: f.tier ?? 'basic', price: f.price ?? 0, billingCycle: f.billingCycle ?? 'monthly', duration: f.duration ?? 1, durationUnit: f.durationUnit ?? 'months', discountPercentage: f.discountPercentage ?? 0, freeServicesPerMonth: f.freeServicesPerMonth ?? 0, priorityBooking: f.priorityBooking ?? false, onlineSignup: f.onlineSignup ?? true, accessCardEnabled: f.accessCardEnabled ?? false, accessCardType: f.accessCardType ?? 'RFID', autoRenew: f.autoRenew ?? true, trialDays: f.trialDays ?? 0, maxMembers: f.maxMembers ?? 0, benefits: f.benefits ?? [], status: f.status ?? 'Active', renewalCount: 0, activeMembers: 0, createdAt: new Date().toISOString().split('T')[0] }]);
      else this.membershipPlans.update(l => l.map(x => x.id === this.editingId() ? { ...x, ...f } as MembershipPlanConfig : x));
    } else if (p === 'employees') {
      const f = this.employeeForm(); if (!f.firstName || !f.lastName) return;
      const newId = Math.max(0, ...this.employees().map(e => e.id)) + 1;
      if (mode === 'add') this.employees.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('EMP', newId), firstName: f.firstName!, lastName: f.lastName!, role: f.role ?? 'therapist', email: f.email ?? '', phone: f.phone ?? '', specialties: f.specialties ?? [], status: f.status ?? 'Active', hireDate: f.hireDate ?? new Date().toISOString().split('T')[0], birthDate: f.birthDate ?? '', gender: f.gender ?? 'Female', address: f.address ?? '', emergencyContact: f.emergencyContact ?? '', notes: f.notes ?? '' }]);
      else this.employees.update(l => l.map(e => e.id === this.editingId() ? { ...e, ...f } as Employee : e));
    } else if (p === 'customers') {
      const f = this.customerForm(); if (!f.firstName || !f.lastName) return;
      const newId = Math.max(0, ...this.customers().map(c => c.id)) + 1;
      if (mode === 'add') this.customers.update(l => [...l, { id: newId, code: f.code ?? this.autoCode('CLT', newId), salutation: f.salutation ?? 'Mr.', firstName: f.firstName!, lastName: f.lastName!, type: f.type ?? 'individual', gender: f.gender ?? 'Male', nationality: f.nationality ?? '', birthDate: f.birthDate ?? '', email: f.email ?? '', contactEmail: f.contactEmail ?? '', phone: f.phone ?? '', telephone: f.telephone ?? '', address: f.address ?? '', membershipId: f.membershipId, tags: f.tags ?? [], notes: f.notes ?? '', questionnaires: [], status: f.status ?? 'Active', createdAt: new Date().toISOString().split('T')[0] }]);
      else this.customers.update(l => l.map(c => c.id === this.editingId() ? { ...c, ...f } as Customer : c));
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
    else if (p === 'pricings') this.pricings.update(l => l.filter(x => x.id !== id));
    else if (p === 'questionnaires') this.qService.questionnaires.update(l => l.filter(x => x.id !== id));
    else if (p === 'memberships') this.membershipPlans.update(l => l.filter(x => x.id !== id));
    else if (p === 'employees') this.employees.update(l => l.filter(e => e.id !== id));
    else if (p === 'customers') this.customers.update(l => l.filter(c => c.id !== id));
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
    else if (p === 'memberships') this.membershipPlans.update(l => l.map(m => m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } as MembershipPlanConfig : m));
    else if (p === 'employees') this.employees.update(l => l.map(e => e.id === id ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } as Employee : e));
    else if (p === 'customers') this.customers.update(l => l.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } as Customer : c));
    else if (p === 'pricings') this.pricings.update(l => l.map(x => x.id === id ? { ...x, active: !x.active } : x));
  }

  private resetForms(): void {
    this.areaForm.set({ active: true, sharedByEmployee: true, availableOnline: true, forGroup: false, maxCapacity: 1 });
    this.areaGroupForm.set({});
    this.packageForm.set({ active: true, durationType: 'Years', duration: 1, services: 0, category: 'Combosale Open' });
    this.serviceGroupForm.set({ active: true, order: 1 });
    this.serviceForm.set({ active: true, availableOnline: false, duration: 60, downTime: 0, price: 0, groupId: 1, status: 'Active', onlineStatus: 'Offline', type: 'Therapy', includedInPackage: false, shortDescription: '', longDescription: '', onlineShortDescription: '', onlineLongDescription: '' });
    this.productGroupForm.set({ active: true });
    this.productForm.set({ active: true, price: 0, groupId: 1, status: 'Active', availableOnline: false, imageUrl: '' });
    this.supplierForm.set({ active: true });
    this.pricingForm.set({ active: true, availableOnline: false, category: 'Normal' });
    this.membershipForm.set({ status: 'Active', tier: 'basic', billingCycle: 'monthly', price: 0, duration: 1, durationUnit: 'months', discountPercentage: 0, freeServicesPerMonth: 0, priorityBooking: false, onlineSignup: true, accessCardEnabled: false, accessCardType: 'RFID', autoRenew: true, trialDays: 0, maxMembers: 0, benefits: [] });
    this.newBenefit.set('');
    this.employeeForm.set({ status: 'Active', role: 'therapist', gender: 'Female', specialties: [] });
    this.customerForm.set({ status: 'Active', type: 'individual', gender: 'Male', salutation: 'Mr.', tags: [], questionnaires: [] });
  }

  private autoCode(prefix: string, id: number): string { return `${prefix}${String(id).padStart(3, '0')}`; }
  private autoBarcode(id: number): string { return `890123456${String(id).padStart(4, '0')}`; }

  getAreaGroupName(groupId?: number): string { return this.areaGroups().find(g => g.id === groupId)?.description ?? '—'; }
  getProductGroupName(groupId?: number): string { return this.productGroups().find(g => g.id === groupId)?.description ?? '—'; }
  getPricingName(pricingId?: number): string { return this.pricings().find(p => p.id === pricingId)?.shortDescription ?? '—'; }
  isNumber(val: number | '...'): val is number { return val !== '...'; }

  duplicateItem(id: number): void {
    const p = this.activePage();
    if (p === 'areas') { const item = this.areas().find(a => a.id === id); if (!item) return; const newId = Math.max(0, ...this.areas().map(a => a.id)) + 1; this.areas.update(l => [...l, { ...item, id: newId, code: item.code + '_COPY', description: item.description + ' (Copy)', order: newId }]); }
    else if (p === 'area-groups') { const item = this.areaGroups().find(g => g.id === id); if (!item) return; const newId = Math.max(0, ...this.areaGroups().map(g => g.id)) + 1; this.areaGroups.update(l => [...l, { ...item, id: newId, description: item.description + ' (Copy)' }]); }
    else if (p === 'packages') { const item = this.packages().find(x => x.id === id); if (!item) return; const newId = Math.max(0, ...this.packages().map(x => x.id)) + 1; this.packages.update(l => [...l, { ...item, id: newId, code: item.code + '_C', shortDescription: item.shortDescription + ' (Copy)' }]); }
    else if (p === 'service-groups') { const item = this.serviceGroups().find(g => g.id === id); if (!item) return; const newId = Math.max(0, ...this.serviceGroups().map(g => g.id)) + 1; this.serviceGroups.update(l => [...l, { ...item, id: newId, code: item.code + '_C', description: item.description + ' (Copy)', order: newId }]); }
    else if (p === 'services') { const item = this.services().find(s => s.id === id); if (!item) return; const newId = Math.max(0, ...this.services().map(s => s.id)) + 1; this.services.update(l => [...l, { ...item, id: newId, code: this.autoCode('SVC', newId), name: item.name + ' (Copy)', barcode: this.autoBarcode(newId) }]); }
    else if (p === 'product-groups') { const item = this.productGroups().find(g => g.id === id); if (!item) return; const newId = Math.max(0, ...this.productGroups().map(g => g.id)) + 1; this.productGroups.update(l => [...l, { ...item, id: newId, code: item.code + '_C', description: item.description + ' (Copy)' }]); }
    else if (p === 'products') { const item = this.products().find(x => x.id === id); if (!item) return; const newId = Math.max(0, ...this.products().map(x => x.id)) + 1; this.products.update(l => [...l, { ...item, id: newId, code: this.autoCode('PRD', newId), name: item.name + ' (Copy)', barcode: this.autoBarcode(newId + 100) }]); }
    else if (p === 'suppliers') { const item = this.suppliers().find(s => s.id === id); if (!item) return; const newId = Math.max(0, ...this.suppliers().map(s => s.id)) + 1; this.suppliers.update(l => [...l, { ...item, id: newId, code: this.autoCode('SUP', newId), name: item.name + ' (Copy)' }]); }
    else if (p === 'pricings') { const item = this.pricings().find(x => x.id === id); if (!item) return; const newId = Math.max(0, ...this.pricings().map(x => x.id)) + 1; this.pricings.update(l => [...l, { ...item, id: newId, code: item.code + '_C', shortDescription: item.shortDescription + ' (Copy)' }]); }
  }


  // ─── Questionnaire (delegated to QuestionnaireService) ───────────────────
  get questionnaires() { return this.qService.questionnaires; }

  // Inline detail state
  selectedQuestionnaire = signal<Questionnaire | null>(null);
  selectedGroup = signal<QuestionGroup | null>(null);
  showGroupModal = signal(false);
  showQuestionModal = signal(false);
  groupForm = signal<Partial<QuestionGroup>>({});
  questionForm = signal<Partial<Question>>({});
  questionOptions = signal<QuestionOption[]>([]);
  newOptionLabel = signal('');

  readonly questionTypes: { value: QuestionType; label: string }[] = [
    { value: 'text', label: 'Short Text' }, { value: 'textarea', label: 'Long Text' },
    { value: 'radio', label: 'Single Choice' }, { value: 'checkbox', label: 'Multiple Choice' },
    { value: 'select', label: 'Dropdown' }, { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' }, { value: 'yesno', label: 'Yes / No' },
  ];

  filteredQuestionnaires = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return this.qService.questionnaires().filter(x => !q || x.description.toLowerCase().includes(q) || x.referenceToken.toLowerCase().includes(q));
  });
  paginatedQuestionnaires = computed(() => this.paginate(this.filteredQuestionnaires()));

  navigateToQuestionnaire(id: number): void { this.router.navigate(['/configuration/questionnaire', id]); }
  openQuestionnaire(q: Questionnaire): void { this.navigateToQuestionnaire(q.id); }

  openServiceDetail(svc: Service): void { this.router.navigate(['/configuration/service', svc.id]); }
  closeServiceDetail(): void { this.selectedService.set(null); }

  onImageUpload(event: Event, target: 'service' | 'product'): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (target === 'service') this.serviceForm.update(f => ({ ...f, imageUrl: dataUrl }));
      else this.productForm.update(f => ({ ...f, imageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  }

  readonly serviceTypes = ['Therapy', 'Treatment', 'Beauty', 'Package', 'Membership', 'Content', 'Consultation', 'Other'];
  readonly onlineStatusOptions = ['Online', 'Offline', 'Draft'];
  readonly pricingCategories = ['Normal', 'Maison', 'Membership', 'Room Charge', 'Credit Card', 'Cash', 'Voucher', 'Package'];
  readonly statusOptions = ['Active', 'Inactive', 'Draft'];

  // ─── Service Detail ───────────────────────────────────────────────────────
  selectedService = signal<Service | null>(null);
  serviceDetailTab = signal<'areas' | 'employee-exceptions' | 'medical-conditions' | 'tax-groups' | 'price-lists' | 'audit'>('areas');

  // Per-service detail data keyed by service id
  serviceAreas = signal<Record<number, number[]>>({}); // serviceId -> areaIds[]
  areaSearchTerm = signal('');

  serviceEmployeeExceptions = signal<Record<number, { id: number; employeeId: string; employeeName: string; reason: string }[]>>({});
  serviceMedicalConditions = signal<Record<number, { id: number; condition: string; notes: string }[]>>({});
  serviceTaxGroups = signal<Record<number, { id: number; name: string; type: string; rate: number }[]>>({});
  servicePriceLists = signal<Record<number, { id: number; pricingId: number; pricingName: string; price: number; taxIncluded: boolean; effectiveFrom: string; effectiveTo: string; active: boolean }[]>>({});
  servicePriceHistory = signal<Record<number, { id: number; pricingName: string; oldPrice: number; newPrice: number; changedBy: string; changedAt: string }[]>>({});
  serviceAuditLog = signal<Record<number, { id: number; action: string; field: string; oldValue: string; newValue: string; changedBy: string; changedAt: string }[]>>({});

  // New entry forms
  newEmployeeException = signal<{ employeeId: string; employeeName: string; reason: string }>({ employeeId: '', employeeName: '', reason: '' });
  newMedicalCondition = signal<{ condition: string; notes: string }>({ condition: '', notes: '' });
  newTaxGroup = signal<{ name: string; type: string; rate: number }>({ name: '', type: 'Percentage', rate: 0 });
  newPriceEntry = signal<{ pricingId: number; price: number; taxIncluded: boolean; effectiveFrom: string; effectiveTo: string }>({ pricingId: 1, price: 0, taxIncluded: true, effectiveFrom: new Date().toISOString().split('T')[0], effectiveTo: '' });

  readonly taxTypes = ['Percentage', 'Fixed', 'Exempt'];
  readonly employeeList = [
    { id: 't1', name: 'Emma Wilson' }, { id: 't2', name: 'Olivia Martinez' },
    { id: 't3', name: 'Sophia Kim' }, { id: 't4', name: 'Isabella Davis' }, { id: 't5', name: 'Mia Johnson' }
  ];


  // Areas dual-list
  availableAreas = computed(() => {
    const svc = this.selectedService();
    if (!svc) return [];
    const selected = this.serviceAreas()[svc.id] ?? [];
    const q = this.areaSearchTerm().toLowerCase();
    return this.areas().filter(a => !selected.includes(a.id) && (!q || a.description.toLowerCase().includes(q)));
  });

  selectedAreas = computed(() => {
    const svc = this.selectedService();
    if (!svc) return [];
    const selected = this.serviceAreas()[svc.id] ?? [];
    return this.areas().filter(a => selected.includes(a.id));
  });

  areaSelection = signal<number[]>([]); // highlighted in left list
  selectedAreaSelection = signal<number[]>([]); // highlighted in right list

  toggleAreaSelection(id: number): void {
    this.areaSelection.update(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }
  toggleSelectedAreaSelection(id: number): void {
    this.selectedAreaSelection.update(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  addAreas(): void {
    const svc = this.selectedService(); if (!svc) return;
    const toAdd = this.areaSelection();
    this.serviceAreas.update(m => ({ ...m, [svc.id]: [...(m[svc.id] ?? []), ...toAdd] }));
    this.areaSelection.set([]);
    this.logAudit(svc.id, 'Added Areas', toAdd.map(id => this.areas().find(a => a.id === id)?.description ?? '').join(', '));
  }

  removeAreas(): void {
    const svc = this.selectedService(); if (!svc) return;
    const toRemove = this.selectedAreaSelection();
    this.serviceAreas.update(m => ({ ...m, [svc.id]: (m[svc.id] ?? []).filter(id => !toRemove.includes(id)) }));
    this.selectedAreaSelection.set([]);
    this.logAudit(svc.id, 'Removed Areas', toRemove.map(id => this.areas().find(a => a.id === id)?.description ?? '').join(', '));
  }

  // Employee exceptions
  addEmployeeException(): void {
    const svc = this.selectedService(); if (!svc) return;
    const f = this.newEmployeeException();
    if (!f.employeeId) return;
    const emp = this.employeeList.find(e => e.id === f.employeeId);
    const newId = Math.max(0, ...(this.serviceEmployeeExceptions()[svc.id] ?? []).map(e => e.id ?? 0)) + 1;
    this.serviceEmployeeExceptions.update(m => ({ ...m, [svc.id]: [...(m[svc.id] ?? []), { employeeId: f.employeeId, employeeName: emp?.name ?? f.employeeId, reason: f.reason, id: newId } as any] }));
    this.newEmployeeException.set({ employeeId: '', employeeName: '', reason: '' });
    this.logAudit(svc.id, 'Added Employee Exception', emp?.name ?? f.employeeId);
  }

  removeEmployeeException(idx: number): void {
    const svc = this.selectedService(); if (!svc) return;
    const item = (this.serviceEmployeeExceptions()[svc.id] ?? [])[idx];
    this.serviceEmployeeExceptions.update(m => ({ ...m, [svc.id]: (m[svc.id] ?? []).filter((_, i) => i !== idx) }));
    this.logAudit(svc.id, 'Removed Employee Exception', item?.employeeName ?? '');
  }

  // Medical conditions
  addMedicalCondition(): void {
    const svc = this.selectedService(); if (!svc) return;
    const f = this.newMedicalCondition();
    if (!f.condition) return;
    const newId = Math.max(0, ...(this.serviceMedicalConditions()[svc.id] ?? []).map(c => c.id)) + 1;
    this.serviceMedicalConditions.update(m => ({ ...m, [svc.id]: [...(m[svc.id] ?? []), { id: newId, condition: f.condition, notes: f.notes }] }));
    this.newMedicalCondition.set({ condition: '', notes: '' });
    this.logAudit(svc.id, 'Added Medical Condition', f.condition);
  }

  removeMedicalCondition(id: number): void {
    const svc = this.selectedService(); if (!svc) return;
    const item = (this.serviceMedicalConditions()[svc.id] ?? []).find(c => c.id === id);
    this.serviceMedicalConditions.update(m => ({ ...m, [svc.id]: (m[svc.id] ?? []).filter(c => c.id !== id) }));
    this.logAudit(svc.id, 'Removed Medical Condition', item?.condition ?? '');
  }

  // Tax groups
  addTaxGroup(): void {
    const svc = this.selectedService(); if (!svc) return;
    const f = this.newTaxGroup();
    if (!f.name) return;
    const newId = Math.max(0, ...(this.serviceTaxGroups()[svc.id] ?? []).map(t => t.id)) + 1;
    this.serviceTaxGroups.update(m => ({ ...m, [svc.id]: [...(m[svc.id] ?? []), { id: newId, name: f.name, type: f.type, rate: f.rate }] }));
    this.newTaxGroup.set({ name: '', type: 'Percentage', rate: 0 });
    this.logAudit(svc.id, 'Added Tax Group', `${f.name} ${f.rate}${f.type === 'Percentage' ? '%' : ''}`);
  }

  removeTaxGroup(id: number): void {
    const svc = this.selectedService(); if (!svc) return;
    this.serviceTaxGroups.update(m => ({ ...m, [svc.id]: (m[svc.id] ?? []).filter(t => t.id !== id) }));
    this.logAudit(svc.id, 'Removed Tax Group', String(id));
  }

  // Price lists
  addPriceEntry(): void {
    const svc = this.selectedService(); if (!svc) return;
    const f = this.newPriceEntry();
    const pricing = this.pricings().find(p => p.id === f.pricingId);
    const newId = Math.max(0, ...(this.servicePriceLists()[svc.id] ?? []).map(p => p.id)) + 1;
    const oldPrice = svc.price;
    this.servicePriceLists.update(m => ({ ...m, [svc.id]: [...(m[svc.id] ?? []), { id: newId, pricingId: f.pricingId, pricingName: pricing?.shortDescription ?? '', price: f.price, taxIncluded: f.taxIncluded, effectiveFrom: f.effectiveFrom, effectiveTo: f.effectiveTo, active: true }] }));
    // add to history
    this.servicePriceHistory.update(m => ({ ...m, [svc.id]: [{ id: (m[svc.id]?.length ?? 0) + 1, pricingName: pricing?.shortDescription ?? '', oldPrice, newPrice: f.price, changedBy: 'Admin', changedAt: new Date().toLocaleString() }, ...(m[svc.id] ?? [])] }));
    this.newPriceEntry.set({ pricingId: 1, price: 0, taxIncluded: true, effectiveFrom: new Date().toISOString().split('T')[0], effectiveTo: '' });
    this.logAudit(svc.id, 'Updated Price', `${pricing?.shortDescription}: $${f.price}`);
  }

  removePriceEntry(id: number): void {
    const svc = this.selectedService(); if (!svc) return;
    this.servicePriceLists.update(m => ({ ...m, [svc.id]: (m[svc.id] ?? []).filter(p => p.id !== id) }));
    this.logAudit(svc.id, 'Removed Price Entry', String(id));
  }

  private logAudit(serviceId: number, action: string, detail: string): void {
    const newId = Math.max(0, ...(this.serviceAuditLog()[serviceId] ?? []).map(a => a.id)) + 1;
    this.serviceAuditLog.update(m => ({ ...m, [serviceId]: [{ id: newId, action, field: detail, oldValue: '—', newValue: '—', changedBy: 'Admin', changedAt: new Date().toLocaleString() }, ...(m[serviceId] ?? [])] }));
  }
}
