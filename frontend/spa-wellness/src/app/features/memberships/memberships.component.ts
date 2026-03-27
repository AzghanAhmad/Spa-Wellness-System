import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { MembershipPlan, Membership } from '../../core/models';

@Component({
  selector: 'app-memberships',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="memberships-page">
      <div class="page-header">
        <div><h1 class="page-title">Memberships</h1><p class="page-subtitle">Manage membership plans and members</p></div>
      </div>

      <!-- Plans Section -->
      <h3 class="section-title">Available Plans</h3>
      <div class="plans-grid stagger-children">
        @for (plan of plans(); track plan.id) {
          <div class="plan-card" [class.popular]="plan.isPopular">
            @if (plan.isPopular) { <div class="popular-badge">Most Popular</div> }
            <div class="plan-tier" [class]="'tier-' + plan.tier">{{ plan.tier | uppercase }}</div>
            <h3 class="plan-name">{{ plan.name }}</h3>
            <div class="plan-price">
              <span class="price-amount">\${{ plan.price }}</span>
              <span class="price-cycle">/{{ plan.billingCycle }}</span>
            </div>
            <div class="plan-discount">{{ plan.discountPercentage }}% off all services</div>
            <ul class="plan-features">
              @for (feature of plan.features; track feature) {
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ feature }}
                </li>
              }
            </ul>
            <button class="btn-primary plan-btn" [class.btn-outline]="!plan.isPopular">Choose Plan</button>
          </div>
        }
      </div>

      <!-- Active Members -->
      <h3 class="section-title" style="margin-top: 40px;">Active Members</h3>
      <div class="card members-table-card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Usage</th>
                <th>Expiry</th>
                <th>Auto-Renew</th>
              </tr>
            </thead>
            <tbody>
              @for (member of members(); track member.id) {
                <tr>
                  <td><span class="member-name">{{ member.customerName }}</span></td>
                  <td>{{ member.planName }}</td>
                  <td><span class="tier-badge" [class]="'tier-' + member.tier">{{ member.tier }}</span></td>
                  <td><span class="badge-success">{{ member.status }}</span></td>
                  <td>
                    <div class="usage-bar-container">
                      <div class="usage-bar"><div class="usage-fill" [style.width.%]="(member.usedServices / member.totalServicesAllowed) * 100"></div></div>
                      <span class="usage-text">{{ member.usedServices }}/{{ member.totalServicesAllowed }}</span>
                    </div>
                  </td>
                  <td>{{ member.expiryDate }}</td>
                  <td>
                    <span class="toggle" [class.active]="member.autoRenew" (click)="member.autoRenew = !member.autoRenew"></span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrl: './memberships.component.scss'
})
export class MembershipsComponent implements OnInit {
  plans = signal<MembershipPlan[]>([]);
  members = signal<Membership[]>([]);

  constructor(private readonly mockData: MockDataService) {}

  ngOnInit(): void {
    this.mockData.getMembershipPlans().subscribe(p => this.plans.set(p));
    this.mockData.getMemberships().subscribe(m => this.members.set(m));
  }
}
