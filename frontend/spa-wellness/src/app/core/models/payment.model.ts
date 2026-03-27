export type PaymentMethod = 'card' | 'cash' | 'online' | 'voucher';
export type PaymentStatus = 'completed' | 'pending' | 'refunded' | 'failed';
export type PaymentType = 'full' | 'deposit' | 'split';

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  type: PaymentType;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  tip?: number;
  tax: number;
  totalAmount: number;
  paidAt: string;
  refundedAt?: string;
  notes?: string;
}

export interface SplitPayment {
  paymentId: string;
  splits: {
    personName: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
  }[];
}

export interface TransactionSummary {
  totalRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  topPaymentMethod: PaymentMethod;
  revenueByMethod: { method: PaymentMethod; amount: number }[];
  dailyRevenue: { date: string; amount: number }[];
}
