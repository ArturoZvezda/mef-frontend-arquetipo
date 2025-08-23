import { Injectable, Optional, Inject } from '@angular/core';
import { User, Product } from '@mef-frontend-arquetipo/domain';
import { NotificationPort, NotificationData } from '@mef-frontend-arquetipo/application';

/**
 * Tipos de toast notifications
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Interfaz para mostrar toasts en el navegador
 */
export interface ToastService {
  show(message: string, type: ToastType, duration?: number): void;
}

/**
 * Token de inyección para ToastService
 */
export const TOAST_SERVICE_TOKEN = 'TOAST_SERVICE_TOKEN';

/**
 * Implementación de notificaciones usando toasts del navegador
 * Para feedback inmediato al usuario
 */
@Injectable({
  providedIn: 'root'
})
export class ToastNotificationAdapter implements NotificationPort {
  
  private toastService: ToastService;

  constructor(@Optional() @Inject(TOAST_SERVICE_TOKEN) toastService?: ToastService) {
    // Si no se inyecta un ToastService, usar console fallback
    this.toastService = toastService || {
      show: (message: string, type: ToastType) => {
        console.log(`[${type.toUpperCase()}] ${message}`);
      }
    };
  }

  async sendWelcomeEmail(user: User): Promise<void> {
    const message = `Welcome ${user.getName()}! Check your email for confirmation.`;
    this.toastService.show(message, 'success', 5000);
  }

  async sendProductAvailableNotification(user: User, product: Product): Promise<void> {
    const message = `Good news! "${product.getName()}" is now available.`;
    this.toastService.show(message, 'info', 4000);
  }

  async sendReservationConfirmation(user: User, product: Product, quantity: number): Promise<void> {
    const message = `✅ Reserved ${quantity}x "${product.getName()}" successfully!`;
    this.toastService.show(message, 'success', 4000);
  }

  async sendLowStockAlert(product: Product, currentStock: number, threshold: number): Promise<void> {
    const message = currentStock === 0 
      ? `⚠️ "${product.getName()}" is out of stock!`
      : `⚠️ Low stock alert: "${product.getName()}" (${currentStock} left)`;
    
    this.toastService.show(message, 'warning', 6000);
  }

  async send(notification: NotificationData): Promise<void> {
    const displayMessage = notification.subject ? `${notification.subject}: ${notification.content}` : notification.content;
    
    // Mapear tipo de notificación a tipo de toast
    const toastType: ToastType = notification.type === 'system' ? 'info' : 'info';
    
    this.toastService.show(displayMessage, toastType, 3000);
  }

  async sendSimple(recipient: string, subject: string, message: string, type: 'email' | 'sms' | 'push'): Promise<void> {
    const displayMessage = subject ? `${subject}: ${message}` : message;
    this.toastService.show(displayMessage, 'info', 3000);
  }
}