import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  NotificationService,
  NotificationData,
  NotificationType
} from '../../../../core/services/notification';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './notifications-page.html',
  styleUrl: './notifications-page.css'
})
export class NotificationsPage {

  readonly notificationService = inject(NotificationService);

  get notifications(): NotificationData[] {
    return this.notificationService.notifications();
  }

  get unreadCount(): number {
    return this.notificationService.unreadCount();
  }

  markAsRead(notification: NotificationData): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  remove(notification: NotificationData): void {
    this.notificationService.remove(notification.id);
  }

  clearAll(): void {
    this.notificationService.clear();
  }

  getIcon(type: NotificationType): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ⓘ';
      default:
        return 'ⓘ';
    }
  }

  getTypeLabel(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'Succès';
      case 'error':
        return 'Erreur';
      case 'warning':
        return 'Avertissement';
      case 'info':
        return 'Information';
      default:
        return 'Notification';
    }
  }
}