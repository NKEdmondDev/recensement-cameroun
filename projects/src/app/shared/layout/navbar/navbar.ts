import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  NotificationService
} from '../../../core/services/notification';


@Component({
  selector: 'app-navbar',
  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  @Input()
  sidebarOpen = false;


  @Output()
  menuToggle =
    new EventEmitter<void>();


  readonly notificationService =
    inject(NotificationService);


  profileOpen = false;

  notificationsOpen = false;


  // =========================================================
  // MENU MOBILE
  // =========================================================

  toggleMenu(): void {

    this.menuToggle.emit();
  }


  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  toggleNotifications(): void {

    this.notificationsOpen =
      !this.notificationsOpen;

    if (this.notificationsOpen) {
      this.profileOpen = false;
    }
  }


  markAsRead(id: number): void {

    this.notificationService
      .markAsRead(id);
  }


  markAllAsRead(): void {

    this.notificationService
      .markAllAsRead();
  }


  removeNotification(id: number): void {

    this.notificationService
      .remove(id);
  }


  // =========================================================
  // PROFIL
  // =========================================================

  toggleProfile(): void {

    this.profileOpen =
      !this.profileOpen;

    if (this.profileOpen) {
      this.notificationsOpen = false;
    }
  }


  closeProfile(): void {

    this.profileOpen = false;
  }


  // =========================================================
  // CLIC EXTERIEUR
  // =========================================================

  @HostListener(
    'document:click',
    ['$event']
  )
  onDocumentClick(
    event: MouseEvent
  ): void {

    const target =
      event.target as HTMLElement;


    if (
      !target.closest(
        '.notification-area'
      )
    ) {

      this.notificationsOpen =
        false;
    }


    if (
      !target.closest(
        '.profile-area'
      )
    ) {

      this.profileOpen =
        false;
    }
  }
}