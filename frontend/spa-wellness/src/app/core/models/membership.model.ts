export type MembershipTier = 'basic' | 'premium' | 'vip';
export type MembershipStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface MembershipPlan {
  id: string;
  name: string;
  tier: MembershipTier;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  discountPercentage: number;
  freeServicesPerMonth: number;
  priorityBooking: boolean;
  isPopular: boolean;
}

export interface Membership {
  id: string;
  customerId: string;
  customerName: string;
  planId: string;
  planName: string;
  tier: MembershipTier;
  status: MembershipStatus;
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
  usedServices: number;
  totalServicesAllowed: number;
  totalSpent: number;
}
