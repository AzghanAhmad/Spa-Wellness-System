import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dash-grid">
      <section class="card panel left animate-slide-in-left">
        <div class="search"><input class="input" placeholder="Search by name or phone number" /></div>
        <h4>Recent</h4>
        @for (item of recent(); track item.name) {
          <div class="recent-item">
            <div class="avatar">{{ item.initials }}</div>
            <div class="info"><strong>{{ item.name }}</strong><span>{{ item.note }}</span></div>
            <span class="time">{{ item.time }}</span>
          </div>
        }
      </section>

      <section class="card panel center animate-fade-in-up">
        <div class="filter-row">
          <button class="chip active">Everything</button>
          <button class="chip">Appointments</button>
          <button class="chip">Feedback</button>
        </div>
        @for (entry of timeline(); track entry.id) {
          <article class="entry">
            <div class="entry-head">
              <strong>{{ entry.type }}</strong>
              <span>{{ entry.time }}</span>
            </div>
            <p>{{ entry.message }}</p>
            <div class="meta">Center: {{ entry.center }} | Amount: {{ '$' + entry.amount }}</div>
          </article>
        }
      </section>

      <section class="card panel right animate-slide-in-right">
        <h4>Today's appointments (3)</h4>
        <div class="kpis">
          <div><strong>1</strong><span>Yet to come</span></div>
          <div><strong>1</strong><span>In service</span></div>
          <div><strong>1</strong><span>Completed</span></div>
        </div>
        <div class="appt-list">
          <div class="appt"><strong>Hair cut</strong><span>10:45 - 11:30</span></div>
          <div class="appt"><strong>Manicure</strong><span>11:00 - 12:00</span></div>
          <div class="appt"><strong>Blowout</strong><span>12:15 - 12:45</span></div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dash-grid { display: grid; gap: 12px; grid-template-columns: 280px 1fr 290px; }
    .panel { padding: 14px; border: 1px solid #d8e8f7; border-radius: 14px; background: #fff; }
    .left h4, .right h4 { margin: 8px 0 10px; color: #20435f; }
    .search { margin-bottom: 8px; }
    .recent-item { display: grid; grid-template-columns: 36px 1fr auto; gap: 10px; align-items: center; padding: 10px 0; border-bottom: 1px solid #eef4fb; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: #eef6ff; color: #234e7a; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    .info { display: flex; flex-direction: column; }
    .info strong { font-size: .9rem; color: #1f3f5b; }
    .info span { font-size: .8rem; color: #68839b; }
    .time { font-size: .75rem; color: #89a0b5; }
    .filter-row { display: flex; gap: 8px; margin-bottom: 10px; }
    .chip { border: 1px solid #d7e6f6; background: #fff; padding: 6px 10px; border-radius: 9px; color: #476681; }
    .chip.active { background: #eef6ff; color: #0f5ea8; border-color: #9bc5ec; }
    .entry { border: 1px solid #e3eef9; border-radius: 10px; padding: 12px; margin-bottom: 10px; transition: transform .2s ease; }
    .entry:hover { transform: translateY(-2px); }
    .entry-head { display: flex; justify-content: space-between; color: #1d3f5d; margin-bottom: 6px; }
    .entry p { color: #2d4f6b; margin-bottom: 6px; }
    .meta { color: #7a95ab; font-size: .8rem; }
    .kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 10px 0; }
    .kpis div { border: 1px solid #e4eef8; border-radius: 10px; text-align: center; padding: 10px 6px; display: flex; flex-direction: column; }
    .kpis strong { color: #153b5a; font-size: 1.2rem; }
    .kpis span { color: #6b879f; font-size: .75rem; }
    .appt-list { display: grid; gap: 8px; }
    .appt { border: 1px solid #e4eef8; border-radius: 9px; padding: 10px; display: flex; flex-direction: column; }
    .appt strong { color: #1f3f5b; }
    .appt span { color: #7a96ad; font-size: .8rem; }
    @media (max-width: 1100px) { .dash-grid { grid-template-columns: 1fr; } }
  `],
})
export class CustomerDashboardComponent {
  recent = signal([
    { initials: 'LT', name: 'Linda Thomas', note: 'Thanks so much!', time: '1:43 pm' },
    { initials: 'HS', name: 'Harvey Spector', note: 'Chat with smartbot', time: '1:12 pm' },
    { initials: 'MR', name: 'Martin Ross', note: 'Outbound call', time: '12:10 pm' },
    { initials: 'AD', name: 'Anna Duke', note: 'Booking cancelled/no show', time: '11:23 am' },
  ]);

  timeline = signal([
    { id: 't1', type: 'Appointment', message: 'Haircut + blowout with Haley scheduled.', center: 'Boston', amount: 140, time: '10:01 am' },
    { id: 't2', type: 'Feedback', message: 'Great service, fast check-in and friendly staff.', center: 'Boston', amount: 100, time: '10:23 am' },
    { id: 't3', type: 'Joined waitlist', message: 'Requested next available slot for manicure.', center: 'South grand', amount: 90, time: '11:58 am' },
  ]);
}

