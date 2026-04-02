import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wrap animate-fade-in-up">
      <section class="card panel profile">
        <div class="alert">It's Anna's birthday on 28th April. Don't forget to say Happy Birthday!</div>
        <div class="head">
          <div class="avatar"></div>
          <div class="info">
            <h2>Anna Duke</h2>
            <p>annaduke@gmail.com | +1 580-368-2040</p>
            <div class="tags">
              <span class="badge">High spender</span>
              <span class="badge">Member</span>
              <span class="badge">+3</span>
            </div>
          </div>
        </div>
      </section>

      <section class="card panel">
        <h3>Upcoming appointments</h3>
        <div class="appt">
          <strong>23rd Apr at 11:30 am</strong>
          <p>Hair cut with Alex</p>
          <p>Hair Treatment with Alex</p>
          <p>Blowout with Alex</p>
          <div class="meta">Center: South grand | Amount: $140</div>
        </div>
      </section>

      <section class="card panel">
        <h3>Last appointment</h3>
        <div class="appt">
          <strong>2nd Apr at 12:45 pm</strong>
          <p>Hair cut with Alex</p>
          <p>Hair Treatment with Alex</p>
          <p>Blowout with Alex</p>
          <div class="meta">Center: South grand | Amount: $150</div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .wrap { max-width: 760px; display: grid; gap: 12px; }
    .panel { padding: 14px; border: 1px solid #d8e8f7; border-radius: 14px; background: #fff; }
    .alert { background: #e8fbef; color: #2d6b49; padding: 10px 12px; border-radius: 10px; margin-bottom: 10px; }
    .head { display: flex; gap: 12px; }
    .avatar { width: 74px; height: 74px; border-radius: 50%; background: linear-gradient(135deg,#d8e9fb,#bfd8f4); }
    .info h2 { color: #1f3f5b; margin-bottom: 2px; }
    .info p { color: #6e889f; margin-bottom: 8px; }
    .tags { display: flex; gap: 8px; }
    .badge { border: 1px solid #e3eef9; border-radius: 999px; padding: 5px 10px; color: #496781; font-size: .8rem; }
    h3 { color: #1f3f5b; margin-bottom: 10px; }
    .appt { border: 1px solid #e4eef8; border-radius: 10px; padding: 12px; }
    .appt strong { color: #183b56; }
    .appt p { color: #385976; margin-top: 3px; }
    .meta { margin-top: 8px; color: #7f99af; }
  `],
})
export class CustomerProfileComponent {}

