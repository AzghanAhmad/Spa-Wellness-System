import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { MembershipPlan, Membership } from '../../core/models';

@Component({
  selector: 'app-memberships',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div><h1 class="page-title">Memberships & Services</h1><p class="page-subtitle">Manage plans and active members</p></div>
      </div>

      <!-- Plans -->
      <h3 class="section-title">Available Plans</h3>
      <div class="plans-grid stagger-children">
        @for (plan of plans(); track plan.id) {
          <div class="plan-card card" [class.popular]="plan.isPopular">
            @if (plan.isPopular) { <div class="pop-badge">Most Popular</div> }
            <div class="plan-tier" [class]="'tier-' + plan.tier">{{ plan.tier | uppercase }}</div>
            <h3 class="plan-name">{{ plan.name }}</h3>
            <div class="plan-price"><span class="price-amount">{{ '$' + plan.price }}</span><span class="price-cycle">/{{ plan.billingCycle }}</span></div>
            <div class="plan-discount">{{ plan.discountPercentage }}% off</div>
            <ul class="plan-features">@for (f of plan.features; track f) { <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>{{ f }}</li> }</ul>
            <button class="btn-primary plan-btn" [class.btn-outline]="!plan.isPopular">Choose Plan</button>
          </div>
        }
      </div>

      <!-- Members Table -->
      <h3 class="section-title" style="margin-top: 32px;">Active Members</h3>
      <div class="card table-card">
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Member</th><th>Plan</th><th>Tier</th><th>Status</th><th>Usage</th><th>Expiry</th><th>Auto-Renew</th></tr></thead>
            <tbody>
              @for (m of members(); track m.id) {
                <tr>
                  <td class="cell-name">{{ m.customerName }}</td>
                  <td>{{ m.planName }}</td>
                  <td><span class="tier-chip" [class]="'tier-' + m.tier">{{ m.tier }}</span></td>
                  <td><span class="badge-success">{{ m.status }}</span></td>
                  <td>
                    <div class="usage-row">
                      <div class="usage-bar"><div class="usage-fill" [style.width.%]="(m.usedServices / m.totalServicesAllowed) * 100"></div></div>
                      <span class="usage-text">{{ m.usedServices }}/{{ m.totalServicesAllowed }}</span>
                    </div>
                  </td>
                  <td>{{ m.expiryDate }}</td>
                  <td><span class="toggle" [class.active]="m.autoRenew" (click)="m.autoRenew = !m.autoRenew"></span></td>
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
