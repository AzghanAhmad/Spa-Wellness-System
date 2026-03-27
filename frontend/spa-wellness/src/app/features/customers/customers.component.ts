import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { Customer, VisitHistory } from '../../core/models';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  customers = signal<Customer[]>([]);
  selectedCustomer = signal<Customer | null>(null);
  visitHistory = signal<VisitHistory[]>([]);
  isLoading = signal(true);
  searchTerm = signal('');
  tagFilter = signal('all');
  showEditDrawer = signal(false);

  editForm: Partial<Customer> = {};

  filteredCustomers = computed(() => {
    let result = this.customers();
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.phone.includes(search)
      );
    }
    const tag = this.tagFilter();
    if (tag !== 'all') {
      result = result.filter(c => c.tags?.includes(tag));
    }
    return result;
  });

  allTags = computed(() => {
    const tags = new Set<string>();
    this.customers().forEach(c => c.tags?.forEach(t => tags.add(t)));
    return Array.from(tags);
  });

  constructor(
    private readonly mockData: MockDataService,
    private readonly notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.mockData.getCustomers().subscribe(c => {
      this.customers.set(c);
      this.isLoading.set(false);
    });
  }

  selectCustomer(customer: Customer): void {
    this.selectedCustomer.set(customer);
    this.mockData.getVisitHistory(customer.id).subscribe(h => this.visitHistory.set(h));
  }

  openEditForm(customer: Customer): void {
    this.editForm = { ...customer };
    this.showEditDrawer.set(true);
  }

  saveCustomer(): void {
    this.notification.success('Customer Updated', 'Profile has been saved');
    this.showEditDrawer.set(false);
  }

  getInitials(customer: Customer): string {
    return (customer.firstName[0] + customer.lastName[0]).toUpperCase();
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString();
  }
}
