// src/services/notificationService.ts
// In-App Real-Time Alert Manager & Push Notification Subscriber

import { AppNotification } from '../types';

type NotificationListener = (notification: AppNotification) => void;

class NotificationService {
  private listeners: Set<NotificationListener> = new Set();

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public show(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): void {
    const fullNotification: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    this.listeners.forEach((listener) => {
      try {
        listener(fullNotification);
      } catch {}
    });
  }

  public showSuccess(title: string, message: string): void {
    this.show({ title, message, type: 'success' });
  }

  public showAlert(title: string, message: string): void {
    this.show({ title, message, type: 'alert' });
  }

  public showInfo(title: string, message: string): void {
    this.show({ title, message, type: 'info' });
  }
}

export const notificationService = new NotificationService();
