import {
  Component
} from '@angular/core';


@Component({
  selector: 'app-settings',

  standalone: true,

  imports: [],

  templateUrl: './settings.html',

  styleUrl: './settings.css'
})
export class Settings {

  notificationsEnabled = true;

  compactMode = false;


  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  toggleNotifications(): void {

    this.notificationsEnabled =
      !this.notificationsEnabled;
  }


  // =========================================================
  // AFFICHAGE COMPACT
  // =========================================================

  toggleCompactMode(): void {

    this.compactMode =
      !this.compactMode;
  }


  // =========================================================
  // REINITIALISATION
  // =========================================================

  reset(): void {

    this.notificationsEnabled = true;

    this.compactMode = false;
  }

}