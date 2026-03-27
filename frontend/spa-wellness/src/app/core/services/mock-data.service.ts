import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Booking, SpaService, Therapist, Room, Equipment,
  Customer, MembershipPlan, Membership, GiftVoucher,
  Payment, Campaign, ConsultationForm, FormResponse,
  NotificationSettings, VisitHistory
} from '../models';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  private simulateDelay<T>(data: T): Observable<T> {
    return of(data).pipe(delay(environment.mockApiDelay));
  }

  // ==================== SERVICES ====================
  getServices(): Observable<SpaService[]> {
    return this.simulateDelay([
      { id: 's1', name: 'Swedish Massage', description: 'A gentle full-body massage to relax muscles and improve circulation.', category: 'massage', duration: 60, price: 120, isActive: true },
      { id: 's2', name: 'Deep Tissue Massage', description: 'Intense massage targeting deep layers of muscle tissue for chronic pain relief.', category: 'massage', duration: 75, price: 150, isActive: true },
      { id: 's3', name: 'Hot Stone Therapy', description: 'Heated stones placed on key points to ease tension and improve energy flow.', category: 'massage', duration: 90, price: 180, isActive: true },
      { id: 's4', name: 'Aromatherapy Massage', description: 'Essential oil-infused massage to promote relaxation and well-being.', category: 'massage', duration: 60, price: 135, isActive: true },
      { id: 's5', name: 'Hydrating Facial', description: 'Deep moisturizing facial treatment for dry and dehydrated skin.', category: 'facial', duration: 45, price: 95, isActive: true },
      { id: 's6', name: 'Anti-Aging Facial', description: 'Advanced facial treatment to reduce fine lines and improve skin elasticity.', category: 'facial', duration: 60, price: 145, isActive: true },
      { id: 's7', name: 'Body Wrap', description: 'Detoxifying body wrap using natural minerals and herbs.', category: 'body-treatment', duration: 75, price: 160, isActive: true },
      { id: 's8', name: 'Salt Scrub Exfoliation', description: 'Full-body exfoliation with mineral-rich sea salt to reveal glowing skin.', category: 'body-treatment', duration: 45, price: 85, isActive: true },
      { id: 's9', name: 'Gel Manicure', description: 'Long-lasting gel manicure with cuticle care and hand massage.', category: 'nail', duration: 45, price: 55, isActive: true },
      { id: 's10', name: 'Luxury Pedicure', description: 'Full pedicure with foot soak, exfoliation, and massage.', category: 'nail', duration: 60, price: 75, isActive: true },
      { id: 's11', name: 'Hair Styling', description: 'Professional hair styling including wash, cut, and blow dry.', category: 'hair', duration: 60, price: 90, isActive: true },
      { id: 's12', name: 'Wellness Package', description: 'Complete day package: massage, facial, and body treatment.', category: 'package', duration: 180, price: 350, isActive: true },
    ]);
  }

  // ==================== THERAPISTS ====================
  getTherapists(): Observable<Therapist[]> {
    const defaultHours = {
      monday: { isWorking: true, start: '09:00', end: '18:00' },
      tuesday: { isWorking: true, start: '09:00', end: '18:00' },
      wednesday: { isWorking: true, start: '09:00', end: '18:00' },
      thursday: { isWorking: true, start: '09:00', end: '18:00' },
      friday: { isWorking: true, start: '09:00', end: '18:00' },
      saturday: { isWorking: true, start: '10:00', end: '16:00' },
      sunday: { isWorking: false, start: '', end: '' },
    };
    return this.simulateDelay([
      { id: 't1', name: 'Emma Wilson', email: 'emma@serenity.com', phone: '+1-555-0201', specialties: ['massage', 'body-treatment'], isAvailable: true, workingHours: defaultHours, rating: 4.9, totalBookings: 342 },
      { id: 't2', name: 'Olivia Martinez', email: 'olivia@serenity.com', phone: '+1-555-0202', specialties: ['facial', 'body-treatment'], isAvailable: true, workingHours: defaultHours, rating: 4.8, totalBookings: 298 },
      { id: 't3', name: 'Sophia Kim', email: 'sophia@serenity.com', phone: '+1-555-0203', specialties: ['massage', 'wellness'], isAvailable: false, workingHours: defaultHours, rating: 4.7, totalBookings: 265 },
      { id: 't4', name: 'Isabella Davis', email: 'isabella@serenity.com', phone: '+1-555-0204', specialties: ['nail', 'hair'], isAvailable: true, workingHours: defaultHours, rating: 4.9, totalBookings: 310 },
      { id: 't5', name: 'Mia Johnson', email: 'mia@serenity.com', phone: '+1-555-0205', specialties: ['massage', 'facial', 'wellness'], isAvailable: true, workingHours: defaultHours, rating: 4.6, totalBookings: 220 },
    ]);
  }

  // ==================== ROOMS ====================
  getRooms(): Observable<Room[]> {
    return this.simulateDelay([
      { id: 'r1', name: 'Tranquility Suite', type: 'massage', capacity: 1, isAvailable: true, amenities: ['heated table', 'aromatherapy diffuser', 'sound system'] },
      { id: 'r2', name: 'Zen Room', type: 'massage', capacity: 2, isAvailable: true, amenities: ['couples setup', 'candles', 'private shower'] },
      { id: 'r3', name: 'Glow Studio', type: 'facial', capacity: 1, isAvailable: true, amenities: ['magnifying lamp', 'steamer', 'LED therapy'] },
      { id: 'r4', name: 'Wellness Lounge', type: 'body-treatment', capacity: 1, isAvailable: false, amenities: ['wet room', 'vichy shower', 'steam'] },
      { id: 'r5', name: 'Beauty Bar', type: 'nail', capacity: 4, isAvailable: true, amenities: ['UV lamps', 'pedicure chairs', 'nail station'] },
      { id: 'r6', name: 'Style Studio', type: 'hair', capacity: 3, isAvailable: true, amenities: ['salon chairs', 'wash station', 'dryers'] },
    ]);
  }

  // ==================== EQUIPMENT ====================
  getEquipment(): Observable<Equipment[]> {
    return this.simulateDelay([
      { id: 'e1', name: 'Hot Stone Set', type: 'massage', isAvailable: true },
      { id: 'e2', name: 'Aromatherapy Kit', type: 'massage', isAvailable: true },
      { id: 'e3', name: 'LED Light Therapy', type: 'facial', isAvailable: true },
      { id: 'e4', name: 'Microdermabrasion', type: 'facial', isAvailable: false },
      { id: 'e5', name: 'Body Wrap Kit', type: 'body-treatment', isAvailable: true },
    ]);
  }

  // ==================== BOOKINGS ====================
  getBookings(): Observable<Booking[]> {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    return this.simulateDelay([
      {
        id: 'b1', customerId: 'c1', customerName: 'Alice Thompson', customerEmail: 'alice@email.com', customerPhone: '+1-555-0301',
        services: [{ serviceId: 's1', serviceName: 'Swedish Massage', duration: 60, price: 120 }],
        therapistId: 't1', therapistName: 'Emma Wilson', roomId: 'r1', roomName: 'Tranquility Suite',
        date: today, startTime: '09:00', endTime: '10:00', status: 'confirmed',
        totalPrice: 120, isGroupBooking: false, groupSize: 1, createdAt: '2024-03-20'
      },
      {
        id: 'b2', customerId: 'c2', customerName: 'Jessica Rivera', customerEmail: 'jessica@email.com',
        services: [{ serviceId: 's5', serviceName: 'Hydrating Facial', duration: 45, price: 95 }],
        therapistId: 't2', therapistName: 'Olivia Martinez', roomId: 'r3', roomName: 'Glow Studio',
        date: today, startTime: '10:00', endTime: '10:45', status: 'confirmed',
        totalPrice: 95, isGroupBooking: false, groupSize: 1, createdAt: '2024-03-21'
      },
      {
        id: 'b3', customerId: 'c3', customerName: 'Michael Chen',
        services: [
          { serviceId: 's2', serviceName: 'Deep Tissue Massage', duration: 75, price: 150 },
          { serviceId: 's8', serviceName: 'Salt Scrub Exfoliation', duration: 45, price: 85 }
        ],
        therapistId: 't1', therapistName: 'Emma Wilson', roomId: 'r1', roomName: 'Tranquility Suite',
        date: today, startTime: '11:00', endTime: '13:00', status: 'pending',
        totalPrice: 235, notes: 'First time client', isGroupBooking: false, groupSize: 1, createdAt: '2024-03-22'
      },
      {
        id: 'b4', customerId: 'c4', customerName: 'Sarah Williams',
        services: [{ serviceId: 's12', serviceName: 'Wellness Package', duration: 180, price: 350 }],
        therapistId: 't5', therapistName: 'Mia Johnson', roomId: 'r2', roomName: 'Zen Room',
        date: today, startTime: '13:00', endTime: '16:00', status: 'confirmed',
        totalPrice: 350, isGroupBooking: true, groupSize: 2, createdAt: '2024-03-22'
      },
      {
        id: 'b5', customerId: 'c5', customerName: 'David Park',
        services: [{ serviceId: 's9', serviceName: 'Gel Manicure', duration: 45, price: 55 }],
        therapistId: 't4', therapistName: 'Isabella Davis', roomId: 'r5', roomName: 'Beauty Bar',
        date: today, startTime: '14:00', endTime: '14:45', status: 'completed',
        totalPrice: 55, isGroupBooking: false, groupSize: 1, createdAt: '2024-03-20'
      },
      {
        id: 'b6', customerId: 'c1', customerName: 'Alice Thompson',
        services: [{ serviceId: 's3', serviceName: 'Hot Stone Therapy', duration: 90, price: 180 }],
        therapistId: 't3', therapistName: 'Sophia Kim', roomId: 'r1', roomName: 'Tranquility Suite',
        date: tomorrow, startTime: '10:00', endTime: '11:30', status: 'confirmed',
        totalPrice: 180, isGroupBooking: false, groupSize: 1, createdAt: '2024-03-23'
      },
      {
        id: 'b7', customerId: 'c6', customerName: 'Karen Brown',
        services: [{ serviceId: 's6', serviceName: 'Anti-Aging Facial', duration: 60, price: 145 }],
        therapistId: 't2', therapistName: 'Olivia Martinez', roomId: 'r3', roomName: 'Glow Studio',
        date: tomorrow, startTime: '09:00', endTime: '10:00', status: 'pending',
        totalPrice: 145, isGroupBooking: false, groupSize: 1, createdAt: '2024-03-23'
      },
      {
        id: 'b8', customerId: 'c7', customerName: 'Robert Taylor',
        services: [{ serviceId: 's4', serviceName: 'Aromatherapy Massage', duration: 60, price: 135 }],
        therapistId: 't1', therapistName: 'Emma Wilson', roomId: 'r2', roomName: 'Zen Room',
        date: today, startTime: '16:00', endTime: '17:00', status: 'cancelled',
        totalPrice: 135, isGroupBooking: false, groupSize: 1, createdAt: '2024-03-21'
      },
    ]);
  }

  // ==================== CUSTOMERS ====================
  getCustomers(): Observable<Customer[]> {
    return this.simulateDelay([
      {
        id: 'c1', firstName: 'Alice', lastName: 'Thompson', email: 'alice@email.com', phone: '+1-555-0301',
        gender: 'female', preferences: { preferredTherapist: 't1', favoriteServices: ['s1', 's3'], communicationPreference: 'email', marketingOptIn: true },
        tags: ['VIP', 'Regular'], membershipId: 'm1', totalVisits: 24, totalSpent: 4280, lastVisit: '2024-03-15', createdAt: '2023-01-10'
      },
      {
        id: 'c2', firstName: 'Jessica', lastName: 'Rivera', email: 'jessica@email.com', phone: '+1-555-0302',
        gender: 'female', preferences: { favoriteServices: ['s5', 's6'], communicationPreference: 'both', marketingOptIn: true },
        tags: ['Regular'], totalVisits: 12, totalSpent: 1890, lastVisit: '2024-03-18', createdAt: '2023-06-15'
      },
      {
        id: 'c3', firstName: 'Michael', lastName: 'Chen', email: 'michael@email.com', phone: '+1-555-0303',
        gender: 'male', preferences: { communicationPreference: 'email', marketingOptIn: false },
        tags: ['New'], totalVisits: 1, totalSpent: 235, createdAt: '2024-03-22'
      },
      {
        id: 'c4', firstName: 'Sarah', lastName: 'Williams', email: 'sarah@email.com', phone: '+1-555-0304',
        gender: 'female', preferences: { preferredTherapist: 't5', communicationPreference: 'sms', marketingOptIn: true },
        tags: ['Premium'], membershipId: 'm2', totalVisits: 36, totalSpent: 8500, lastVisit: '2024-03-20', createdAt: '2022-09-01'
      },
      {
        id: 'c5', firstName: 'David', lastName: 'Park', email: 'david@email.com', phone: '+1-555-0305',
        gender: 'male', preferences: { communicationPreference: 'email', marketingOptIn: true },
        totalVisits: 8, totalSpent: 640, lastVisit: '2024-03-10', createdAt: '2023-11-20'
      },
      {
        id: 'c6', firstName: 'Karen', lastName: 'Brown', email: 'karen@email.com', phone: '+1-555-0306',
        gender: 'female', preferences: { preferredTherapist: 't2', communicationPreference: 'both', marketingOptIn: true },
        tags: ['VIP'], membershipId: 'm3', totalVisits: 48, totalSpent: 12400, lastVisit: '2024-03-22', createdAt: '2022-03-15'
      },
      {
        id: 'c7', firstName: 'Robert', lastName: 'Taylor', email: 'robert@email.com', phone: '+1-555-0307',
        gender: 'male', preferences: { communicationPreference: 'sms', marketingOptIn: false },
        totalVisits: 3, totalSpent: 405, lastVisit: '2024-02-28', createdAt: '2024-01-05'
      },
    ]);
  }

  // ==================== MEMBERSHIPS ====================
  getMembershipPlans(): Observable<MembershipPlan[]> {
    return this.simulateDelay([
      {
        id: 'mp1', name: 'Essentials', tier: 'basic', price: 49, billingCycle: 'monthly',
        features: ['10% off all services', '1 free service/month', 'Priority booking', 'Birthday discount'],
        discountPercentage: 10, freeServicesPerMonth: 1, priorityBooking: false, isPopular: false
      },
      {
        id: 'mp2', name: 'Premium Bliss', tier: 'premium', price: 99, billingCycle: 'monthly',
        features: ['20% off all services', '3 free services/month', 'Priority booking', 'Birthday discount', 'Free product samples', 'Guest passes'],
        discountPercentage: 20, freeServicesPerMonth: 3, priorityBooking: true, isPopular: true
      },
      {
        id: 'mp3', name: 'VIP Serenity', tier: 'vip', price: 199, billingCycle: 'monthly',
        features: ['30% off all services', 'Unlimited services', 'VIP priority booking', 'Birthday discount', 'Free products quarterly', 'Unlimited guest passes', 'Personal wellness consult', 'Exclusive events access'],
        discountPercentage: 30, freeServicesPerMonth: 99, priorityBooking: true, isPopular: false
      },
    ]);
  }

  getMemberships(): Observable<Membership[]> {
    return this.simulateDelay([
      { id: 'm1', customerId: 'c1', customerName: 'Alice Thompson', planId: 'mp1', planName: 'Essentials', tier: 'basic', status: 'active', startDate: '2024-01-15', expiryDate: '2025-01-15', autoRenew: true, usedServices: 8, totalServicesAllowed: 12, totalSpent: 588 },
      { id: 'm2', customerId: 'c4', customerName: 'Sarah Williams', planId: 'mp2', planName: 'Premium Bliss', tier: 'premium', status: 'active', startDate: '2023-09-01', expiryDate: '2024-09-01', autoRenew: true, usedServices: 28, totalServicesAllowed: 36, totalSpent: 1782 },
      { id: 'm3', customerId: 'c6', customerName: 'Karen Brown', planId: 'mp3', planName: 'VIP Serenity', tier: 'vip', status: 'active', startDate: '2023-03-15', expiryDate: '2024-03-15', autoRenew: true, usedServices: 45, totalServicesAllowed: 99, totalSpent: 2388 },
    ]);
  }

  // ==================== VOUCHERS ====================
  getVouchers(): Observable<GiftVoucher[]> {
    return this.simulateDelay([
      { id: 'v1', code: 'GIFT-A1B2C3', type: 'monetary', amount: 100, recipientName: 'Lisa Green', recipientEmail: 'lisa@email.com', senderName: 'Alice Thompson', senderEmail: 'alice@email.com', message: 'Happy Birthday! Enjoy some pampering.', status: 'active', expiryDate: '2024-12-31', createdAt: '2024-03-01' },
      { id: 'v2', code: 'GIFT-D4E5F6', type: 'package', packageId: 's12', packageName: 'Wellness Package', recipientName: 'John Miller', recipientEmail: 'john@email.com', senderName: 'Sarah Williams', senderEmail: 'sarah@email.com', status: 'redeemed', expiryDate: '2024-06-30', createdAt: '2024-02-14', redeemedAt: '2024-03-10' },
      { id: 'v3', code: 'GIFT-G7H8I9', type: 'monetary', amount: 250, recipientName: 'Maria Lopez', recipientEmail: 'maria@email.com', senderName: 'Karen Brown', senderEmail: 'karen@email.com', message: 'Treat yourself!', status: 'active', expiryDate: '2025-03-01', createdAt: '2024-03-15' },
    ]);
  }

  // ==================== PAYMENTS ====================
  getPayments(): Observable<Payment[]> {
    return this.simulateDelay([
      { id: 'p1', bookingId: 'b1', customerId: 'c1', customerName: 'Alice Thompson', amount: 120, method: 'card', status: 'completed', type: 'full', tax: 9.60, totalAmount: 129.60, paidAt: '2024-03-20T09:00:00' },
      { id: 'p2', bookingId: 'b2', customerId: 'c2', customerName: 'Jessica Rivera', amount: 95, method: 'online', status: 'completed', type: 'full', tax: 7.60, totalAmount: 102.60, paidAt: '2024-03-21T10:00:00' },
      { id: 'p3', bookingId: 'b3', customerId: 'c3', customerName: 'Michael Chen', amount: 117.50, method: 'card', status: 'pending', type: 'deposit', tax: 9.40, totalAmount: 126.90, paidAt: '2024-03-22T11:00:00' },
      { id: 'p4', bookingId: 'b4', customerId: 'c4', customerName: 'Sarah Williams', amount: 350, method: 'card', status: 'completed', type: 'full', discount: 20, discountType: 'percentage', tax: 22.40, totalAmount: 302.40, paidAt: '2024-03-22T13:00:00' },
      { id: 'p5', bookingId: 'b5', customerId: 'c5', customerName: 'David Park', amount: 55, method: 'cash', status: 'completed', type: 'full', tax: 4.40, totalAmount: 59.40, paidAt: '2024-03-20T14:00:00' },
    ]);
  }

  // ==================== CAMPAIGNS ====================
  getCampaigns(): Observable<Campaign[]> {
    return this.simulateDelay([
      {
        id: 'camp1', name: 'Spring Wellness Special', type: 'email', status: 'active', subject: 'Spring into Wellness - 25% Off!',
        content: 'Celebrate spring with exclusive savings on our most popular treatments.', audience: 'all', audienceCount: 1450,
        sentDate: '2024-03-15', stats: { sent: 1450, delivered: 1420, opened: 680, clicked: 245, unsubscribed: 3, openRate: 47.9, clickRate: 17.3 }, createdAt: '2024-03-10'
      },
      {
        id: 'camp2', name: 'VIP Exclusive Event', type: 'email', status: 'scheduled', subject: 'You\'re Invited: VIP Spa Night',
        content: 'An exclusive evening of pampering for our VIP members.', audience: 'vip-members', audienceCount: 85,
        scheduledDate: '2024-04-01', stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, unsubscribed: 0, openRate: 0, clickRate: 0 }, createdAt: '2024-03-20'
      },
      {
        id: 'camp3', name: 'Appointment Reminder', type: 'sms', status: 'active',
        content: 'Hi {name}, this is a reminder of your appointment tomorrow at {time}.',
        audience: 'all', audienceCount: 320, sentDate: '2024-03-22',
        stats: { sent: 320, delivered: 315, opened: 298, clicked: 0, unsubscribed: 1, openRate: 94.6, clickRate: 0 }, createdAt: '2024-03-18'
      },
    ]);
  }

  // ==================== CONSULTATION FORMS ====================
  getConsultationForms(): Observable<ConsultationForm[]> {
    return this.simulateDelay([
      {
        id: 'f1', title: 'New Client Health Questionnaire', description: 'Required for all first-time clients', isActive: true, createdAt: '2024-01-01',
        fields: [
          { id: 'ff1', label: 'Do you have any allergies?', type: 'textarea', required: true, placeholder: 'List any allergies...' },
          { id: 'ff2', label: 'Are you currently pregnant?', type: 'radio', required: true, options: ['Yes', 'No'] },
          { id: 'ff3', label: 'Medical conditions', type: 'checkbox', required: false, options: ['Heart condition', 'High blood pressure', 'Diabetes', 'Skin conditions', 'Recent surgery', 'None'] },
          { id: 'ff4', label: 'Current medications', type: 'textarea', required: false, placeholder: 'List current medications...' },
          { id: 'ff5', label: 'Pain level (1-10)', type: 'number', required: false, validation: { min: 1, max: 10 } },
        ]
      },
      {
        id: 'f2', title: 'Facial Treatment Consultation', description: 'Pre-treatment questionnaire for facial services', isActive: true, createdAt: '2024-02-01',
        fields: [
          { id: 'ff6', label: 'Skin type', type: 'select', required: true, options: ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'] },
          { id: 'ff7', label: 'Skin concerns', type: 'checkbox', required: true, options: ['Acne', 'Aging', 'Pigmentation', 'Redness', 'Dehydration', 'Other'] },
          { id: 'ff8', label: 'Using retinoids?', type: 'radio', required: true, options: ['Yes', 'No'] },
        ]
      },
    ]);
  }

  getFormResponses(): Observable<FormResponse[]> {
    return this.simulateDelay([
      {
        id: 'fr1', formId: 'f1', customerId: 'c3', customerName: 'Michael Chen',
        responses: { ff1: 'None', ff2: 'No', ff3: ['None'], ff4: '', ff5: '3' },
        restrictions: [], submittedAt: '2024-03-22'
      },
    ]);
  }

  // ==================== NOTIFICATION SETTINGS ====================
  getNotificationSettings(): Observable<NotificationSettings> {
    return this.simulateDelay({
      emailConfirmations: true,
      smsReminders: true,
      reminderHoursBefore: 24,
      followUpAfterVisit: true,
      birthdayGreetings: true,
      promotionalEmails: false,
    });
  }

  // ==================== VISIT HISTORY ====================
  getVisitHistory(customerId: string): Observable<VisitHistory[]> {
    return this.simulateDelay([
      { id: 'vh1', customerId, date: '2024-03-15', services: ['Swedish Massage'], therapist: 'Emma Wilson', totalPaid: 120, rating: 5, feedback: 'Amazing as always!' },
      { id: 'vh2', customerId, date: '2024-02-28', services: ['Hot Stone Therapy'], therapist: 'Sophia Kim', totalPaid: 180, rating: 4 },
      { id: 'vh3', customerId, date: '2024-02-10', services: ['Hydrating Facial', 'Gel Manicure'], therapist: 'Olivia Martinez', totalPaid: 150, rating: 5, feedback: 'Loved the facial!' },
      { id: 'vh4', customerId, date: '2024-01-20', services: ['Deep Tissue Massage'], therapist: 'Emma Wilson', totalPaid: 150, rating: 4 },
      { id: 'vh5', customerId, date: '2024-01-05', services: ['Aromatherapy Massage'], therapist: 'Mia Johnson', totalPaid: 135, rating: 5 },
    ]);
  }

  // ==================== DASHBOARD KPIS ====================
  getDashboardKPIs(): Observable<{
    bookingsToday: number;
    revenue: number;
    revenueChange: number;
    activeClients: number;
    clientsChange: number;
    staffAvailable: number;
    staffTotal: number;
    occupancyRate: number;
  }> {
    return this.simulateDelay({
      bookingsToday: 12,
      revenue: 28450,
      revenueChange: 12.5,
      activeClients: 342,
      clientsChange: 8.2,
      staffAvailable: 4,
      staffTotal: 5,
      occupancyRate: 78,
    });
  }

  getRevenueChartData(): Observable<{ labels: string[]; data: number[] }> {
    return this.simulateDelay({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [3200, 4100, 3800, 4500, 5200, 6100, 1400],
    });
  }

  getBookingsByServiceData(): Observable<{ labels: string[]; data: number[] }> {
    return this.simulateDelay({
      labels: ['Massage', 'Facial', 'Body Treatments', 'Nails', 'Hair', 'Packages'],
      data: [35, 22, 15, 12, 8, 8],
    });
  }
}
