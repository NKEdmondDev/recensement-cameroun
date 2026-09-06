import {
  Component,
  HostListener
} from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { Sidebar } from './shared/layout/sidebar/sidebar';
import { Navbar } from './shared/layout/navbar/navbar';
import { Notifications } from './shared/modals/notifications/notifications';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    RouterOutlet,
    Sidebar,
    Navbar,
    Notifications
  ],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  /**
   * État de la sidebar mobile.
   */
  sidebarOpen = false;


  /**
   * Ouvre / ferme la sidebar.
   */
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }


  /**
   * Ferme la sidebar.
   */
  closeSidebar(): void {
    this.sidebarOpen = false;
  }


  /**
   * Ferme la sidebar avec Échap.
   */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeSidebar();
  }
}