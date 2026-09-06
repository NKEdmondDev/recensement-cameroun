import { Injectable, signal, computed } from '@angular/core';

export type NotificationType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface NotificationData {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly _notifications =
    signal<NotificationData[]>([]);

  readonly notifications =
    this._notifications.asReadonly();

  readonly unreadCount =
    computed(() =>
      this._notifications()
        .filter(notification => !notification.read)
        .length
    );

  private nextId = 1;

  private toastTimeoutId:
    ReturnType<typeof setTimeout> | null = null;

  private readonly _toast =
    signal<NotificationData | null>(null);

  readonly toast =
    this._toast.asReadonly();


  // =========================================================
  // AJOUTER UNE NOTIFICATION
  // =========================================================

  show(
    type: NotificationType,
    title: string,
    message: string
  ): void {

    const notification: NotificationData = {
      id: this.nextId++,
      type,
      title,
      message,
      createdAt: new Date(),
      read: false
    };

    this._notifications.update(
      notifications => [
        notification,
        ...notifications
      ]
    );

    this._toast.set(notification);

    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
    }

    this.toastTimeoutId =
      setTimeout(() => {
        this.closeToast();
      }, 5000);
  }


  // =========================================================
  // RACCOURCIS
  // =========================================================

  success(
    title: string,
    message: string
  ): void {

    this.show(
      'success',
      title,
      message
    );
  }


  error(
    title: string,
    message: string
  ): void {

    this.show(
      'error',
      title,
      message
    );
  }


  warning(
    title: string,
    message: string
  ): void {

    this.show(
      'warning',
      title,
      message
    );
  }


  info(
    title: string,
    message: string
  ): void {

    this.show(
      'info',
      title,
      message
    );
  }


  // =========================================================
  // MARQUER COMME LUE
  // =========================================================

  markAsRead(id: number): void {

    this._notifications.update(
      notifications =>
        notifications.map(notification =>
          notification.id === id
            ? {
                ...notification,
                read: true
              }
            : notification
        )
    );
  }


  // =========================================================
  // TOUT MARQUER COMME LU
  // =========================================================

  markAllAsRead(): void {

    this._notifications.update(
      notifications =>
        notifications.map(notification => ({
          ...notification,
          read: true
        }))
    );
  }


  // =========================================================
  // SUPPRIMER UNE NOTIFICATION
  // =========================================================

  remove(id: number): void {

    this._notifications.update(
      notifications =>
        notifications.filter(
          notification =>
            notification.id !== id
        )
    );
  }


  // =========================================================
  // VIDER LES NOTIFICATIONS
  // =========================================================

  clear(): void {

    this._notifications.set([]);
  }


  // =========================================================
  // FERMER LE TOAST
  // =========================================================

  closeToast(): void {

    if (this.toastTimeoutId) {

      clearTimeout(
        this.toastTimeoutId
      );

      this.toastTimeoutId = null;
    }

    this._toast.set(null);
  }
}