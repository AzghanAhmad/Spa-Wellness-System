export type VoucherType = 'monetary' | 'package';
export type VoucherStatus = 'active' | 'redeemed' | 'expired';

export interface GiftVoucher {
  id: string;
  code: string;
  type: VoucherType;
  amount?: number;
  packageId?: string;
  packageName?: string;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  message?: string;
  status: VoucherStatus;
  expiryDate: string;
  createdAt: string;
  redeemedAt?: string;
}
