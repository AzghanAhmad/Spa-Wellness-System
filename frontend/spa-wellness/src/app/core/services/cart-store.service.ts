import { Injectable, signal } from '@angular/core';

export interface CartLine {
  id: string;
  bookingId: string;
  serviceId: string;
  serviceName: string;
  therapistId: string;
  therapistName: string;
  date: string;
  startTime: string;
  status: string;
  basePrice: number;
  discountPct: number;
  discountAmt: number;
  vatPct: number;
  vatAmt: number;
  netAmount: number;
  grossAmount: number;
  paid: boolean;
}

export interface Cart {
  clientId: string;
  clientName: string;
  priceList: string;
  vatPct: number;
  lines: CartLine[];
}

@Injectable({ providedIn: 'root' })
export class CartStoreService {
  activeCart = signal<Cart | null>(null);

  openCart(clientId: string, clientName: string, lines: CartLine[]): void {
    this.activeCart.set({ clientId, clientName, priceList: 'Normal', vatPct: 19, lines });
  }

  clearCart(): void { this.activeCart.set(null); }

  updateLine(id: string, changes: Partial<CartLine>): void {
    this.activeCart.update(c => {
      if (!c) return c;
      return { ...c, lines: c.lines.map(l => l.id === id ? { ...l, ...changes, ...this.recalc({ ...l, ...changes }) } : l) };
    });
  }

  removeLine(id: string): void {
    this.activeCart.update(c => c ? { ...c, lines: c.lines.filter(l => l.id !== id) } : c);
  }

  togglePaid(id: string): void {
    this.activeCart.update(c => c ? { ...c, lines: c.lines.map(l => l.id === id ? { ...l, paid: !l.paid } : l) } : c);
  }

  private recalc(l: CartLine): Partial<CartLine> {
    const discountAmt = l.basePrice * (l.discountPct / 100);
    const netAmount = Math.max(0, l.basePrice - discountAmt);
    const vatAmt = netAmount * (l.vatPct / 100);
    const grossAmount = netAmount + vatAmt;
    return { discountAmt: +discountAmt.toFixed(2), netAmount: +netAmount.toFixed(2), vatAmt: +vatAmt.toFixed(2), grossAmount: +grossAmount.toFixed(2) };
  }

  buildLine(bookingId: string, serviceId: string, serviceName: string, therapistId: string, therapistName: string, date: string, startTime: string, status: string, price: number, vatPct: number): CartLine {
    const netAmount = price;
    const vatAmt = +(netAmount * vatPct / 100).toFixed(2);
    return { id: `cl-${Date.now()}-${Math.random().toString(36).slice(2)}`, bookingId, serviceId, serviceName, therapistId, therapistName, date, startTime, status, basePrice: price, discountPct: 0, discountAmt: 0, vatPct, vatAmt, netAmount: price, grossAmount: +(price + vatAmt).toFixed(2), paid: false };
  }
}
