import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  NotificationService
} from '../../../core/services/notification';

@Component({
  selector: 'app-sidebar',
  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',

  host: {
    '[class.open]': 'open'
  }
})
export class Sidebar {

  @Input() open = false;

  @Output() closeMenu =
    new EventEmitter<void>();


  // =========================================================
  // SERVICE DE NOTIFICATIONS
  // =========================================================

  readonly notificationService =
    inject(NotificationService);


  // =========================================================
  // FERMER LA SIDEBAR
  // =========================================================

  close(): void {
    this.closeMenu.emit();
  }
}