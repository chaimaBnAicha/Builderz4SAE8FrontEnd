import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

declare var $:any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription!: Subscription;
  unreadCount = 0;
  showNotificationsList = false;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(notification => {
      this.notifications.unshift(notification);
      this.unreadCount++;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleNotifications() {
    this.showNotificationsList = !this.showNotificationsList;
    if (this.showNotificationsList) {
      this.unreadCount = 0;
    }
  }

  clearNotifications() {
    this.notifications = [];
    this.unreadCount = 0;
  }

  showNotification(from: any, align: any){
      const type = ['','info','success','warning','danger'];

      var color = Math.floor((Math.random() * 4) + 1);
      $.notify({
          icon: "pe-7s-gift",
          message: "Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for every web developer."
      },{
          type: type[color],
          timer: 1000,
          placement: {
              from: from,
              align: align
          }
      });
  }
}
