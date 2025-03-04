import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  showSuccess(message: string): void {
    this.notificationSubject.next({
      message,
      type: 'success'
    });
  }

  showError(message: string): void {
    this.notificationSubject.next({
      message,
      type: 'error'
    });
  }

  showWarning(message: string): void {
    this.notificationSubject.next({
      message,
      type: 'warning'
    });
  }

  checkLowStock(stock: any): void {
    if (stock.quantity <= 5) {
      this.showWarning(`Attention: Le stock de ${stock.name} est bas (${stock.quantity} restants)`);
    }
  }
} 