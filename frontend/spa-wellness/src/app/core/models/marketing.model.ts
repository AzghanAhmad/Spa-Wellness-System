export type CampaignType = 'email' | 'sms';
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
export type AudienceSegment = 'all' | 'new-customers' | 'returning' | 'vip-members' | 'inactive' | 'custom';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  subject?: string;
  content: string;
  audience: AudienceSegment;
  audienceCount: number;
  scheduledDate?: string;
  sentDate?: string;
  stats: CampaignStats;
  createdAt: string;
}

export interface CampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
}

export interface NotificationSettings {
  emailConfirmations: boolean;
  smsReminders: boolean;
  reminderHoursBefore: number;
  followUpAfterVisit: boolean;
  birthdayGreetings: boolean;
  promotionalEmails: boolean;
}

export interface MessagePreview {
  type: CampaignType;
  subject?: string;
  body: string;
  recipientName: string;
}
