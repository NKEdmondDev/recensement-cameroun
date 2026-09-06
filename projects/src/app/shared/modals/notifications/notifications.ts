import {
  Component,
  inject
} from '@angular/core';

import {
  NotificationService
} from '../../../core/services/notification';


@Component({
  selector: 'app-notifications',

  standalone: true,

  imports: [],

  templateUrl: './notifications.html',

  styleUrl: './notifications.css'
})
export class Notifications {

  readonly notificationService =
    inject(NotificationService);

}