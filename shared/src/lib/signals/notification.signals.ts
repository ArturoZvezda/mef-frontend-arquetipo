import { Injectable, signal, computed } from '@angular/core';

/**
 * Tipos de notificación
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Posición de notificación
 */
export type NotificationPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'top-center' 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'bottom-center';

/**
 * Notificación
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number; // en ms, 0 = no auto-dismiss
  icon?: string;
  actions?: NotificationAction[];
  data?: any;
  createdAt: Date;
  isRead?: boolean;
  isPersistent?: boolean;
}

/**
 * Acción de notificación
 */
export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

/**
 * Configuración de notificaciones
 */
export interface NotificationConfig {
  position: NotificationPosition;
  maxNotifications: number;
  defaultDuration: number;
  enableSound: boolean;
}

/**
 * Service para manejo de notificaciones con Angular Signals
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // 🔔 Notification State
  private notifications = signal<Notification[]>([]);
  private config = signal<NotificationConfig>({
    position: 'top-right',
    maxNotifications: 5,
    defaultDuration: 5000,
    enableSound: false
  });

  // 📊 Computed States
  readonly activeNotifications = computed(() => 
    this.notifications().filter(n => !n.isRead)
  );

  readonly unreadCount = computed(() => this.activeNotifications().length);

  readonly notificationsByType = computed(() => {
    const notifications = this.notifications();
    return {
      success: notifications.filter(n => n.type === 'success'),
      error: notifications.filter(n => n.type === 'error'),
      warning: notifications.filter(n => n.type === 'warning'),
      info: notifications.filter(n => n.type === 'info')
    };
  });

  readonly hasUnreadNotifications = computed(() => this.unreadCount() > 0);

  // 🔔 NOTIFICATION MANAGEMENT

  /**
   * Mostrar notificación
   */
  show(notification: Omit<Notification, 'id' | 'createdAt'>): string {
    const id = this.generateId();
    const newNotification: Notification = {
      id,
      createdAt: new Date(),
      duration: this.config().defaultDuration,
      isRead: false,
      isPersistent: false,
      ...notification
    };

    this.notifications.update(current => {
      const updated = [newNotification, ...current];
      const maxNotifications = this.config().maxNotifications;
      
      // Mantener solo el número máximo de notificaciones
      return updated.slice(0, maxNotifications);
    });

    // Auto-dismiss si tiene duración
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newNotification.duration);
    }

    // Reproducir sonido si está habilitado
    if (this.config().enableSound) {
      this.playNotificationSound(notification.type);
    }

    return id;
  }

  /**
   * Mostrar notificación de éxito
   */
  success(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'success',
      message,
      title,
      duration,
      icon: 'check-circle'
    });
  }

  /**
   * Mostrar notificación de error
   */
  error(message: string, title?: string, isPersistent = false): string {
    return this.show({
      type: 'error',
      message,
      title,
      duration: isPersistent ? 0 : this.config().defaultDuration * 2,
      icon: 'x-circle',
      isPersistent
    });
  }

  /**
   * Mostrar notificación de advertencia
   */
  warning(message: string, title?: string, actions?: NotificationAction[]): string {
    return this.show({
      type: 'warning',
      message,
      title,
      actions,
      icon: 'alert-triangle'
    });
  }

  /**
   * Mostrar notificación informativa
   */
  info(message: string, title?: string): string {
    return this.show({
      type: 'info',
      message,
      title,
      icon: 'info'
    });
  }

  /**
   * Descartar notificación
   */
  dismiss(id: string): void {
    this.notifications.update(current => 
      current.filter(n => n.id !== id)
    );
  }

  /**
   * Marcar notificación como leída
   */
  markAsRead(id: string): void {
    this.notifications.update(current =>
      current.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  }

  /**
   * Marcar todas como leídas
   */
  markAllAsRead(): void {
    this.notifications.update(current =>
      current.map(n => ({ ...n, isRead: true }))
    );
  }

  /**
   * Limpiar todas las notificaciones
   */
  clear(): void {
    this.notifications.set([]);
  }

  /**
   * Limpiar notificaciones leídas
   */
  clearRead(): void {
    this.notifications.update(current =>
      current.filter(n => !n.isRead)
    );
  }

  /**
   * Limpiar notificaciones por tipo
   */
  clearByType(type: NotificationType): void {
    this.notifications.update(current =>
      current.filter(n => n.type !== type)
    );
  }

  // ⚙️ CONFIGURATION

  /**
   * Actualizar configuración
   */
  updateConfig(config: Partial<NotificationConfig>): void {
    this.config.update(current => ({
      ...current,
      ...config
    }));
  }

  /**
   * Obtener configuración
   */
  getConfig() {
    return this.config.asReadonly();
  }

  // 🎯 UTILITY METHODS

  /**
   * Obtener notificación por ID
   */
  getNotification(id: string): Notification | undefined {
    return this.notifications().find(n => n.id === id);
  }

  /**
   * Verificar si existe notificación
   */
  hasNotification(id: string): boolean {
    return this.notifications().some(n => n.id === id);
  }

  /**
   * Obtener todas las notificaciones
   */
  getAllNotifications() {
    return this.notifications.asReadonly();
  }

  /**
   * Generar ID único para notificación
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Reproducir sonido de notificación
   */
  private playNotificationSound(type: NotificationType): void {
    // Implementación básica de sonido
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Diferentes frecuencias por tipo
        const frequencies = {
          success: 800,
          error: 400,
          warning: 600,
          info: 500
        };

        oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (error) {
        console.warn('Could not play notification sound:', error);
      }
    }
  }

  // 📊 ANALYTICS & HISTORY

  /**
   * Obtener estadísticas de notificaciones
   */
  getStats() {
    const notifications = this.notifications();
    return {
      total: notifications.length,
      unread: this.unreadCount(),
      byType: this.notificationsByType(),
      recent: notifications.filter(n => 
        (Date.now() - n.createdAt.getTime()) < 24 * 60 * 60 * 1000 // últimas 24h
      ).length
    };
  }

  // 🔄 BULK OPERATIONS

  /**
   * Mostrar múltiples notificaciones
   */
  showBatch(notifications: Omit<Notification, 'id' | 'createdAt'>[]): string[] {
    return notifications.map(notification => this.show(notification));
  }

  /**
   * Descartar múltiples notificaciones
   */
  dismissBatch(ids: string[]): void {
    this.notifications.update(current =>
      current.filter(n => !ids.includes(n.id))
    );
  }
}