import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wrap animate-fade-in">
      <h2>Customer Timeline</h2>
      <div class="card item animate-fade-in-up">
        <div class="row"><strong>Appointment</strong><span>10:30 am</span></div>
        <p>Haircut, Hair treatment, Blowout assigned to Alex.</p>
      </div>
      <div class="card item animate-fade-in-up">
        <div class="row"><strong>Inbound call</strong><span>11:05 am</span></div>
        <p>Requested parking confirmation for tomorrow's booking.</p>
      </div>
      <div class="card item animate-fade-in-up">
        <div class="row"><strong>Feedback</strong><span>1:18 pm</span></div>
        <p>Positive sentiment about treatment quality and staff support.</p>
      </div>
    </div>
  `,
  styles: [`
    .wrap { max-width: 880px; display: grid; gap: 10px; }
    h2 { color: #183b56; margin-bottom: 4px; }
    .item { padding: 12px; border: 1px solid #e2edf8; border-radius: 12px; }
    .row { display: flex; justify-content: space-between; color: #1f3f5b; margin-bottom: 6px; }
    p { color: #4c6a83; }
  `],
})
export class CustomerTimelineComponent {}

