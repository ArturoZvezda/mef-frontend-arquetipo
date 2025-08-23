import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { User, Product } from '@mef-frontend-arquetipo/domain';
import { NotificationPort, NotificationData } from '@mef-frontend-arquetipo/application';
import { HttpClientService } from '../http/http-client.service';

/**
 * Payload para envío de email
 */
interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  template?: string;
  templateData?: Record<string, any>;
}

/**
 * Implementación de notificaciones por email real
 * Se conecta con un servicio de email del backend
 */
@Injectable({
  providedIn: 'root'
})
export class EmailNotificationAdapter implements NotificationPort {
  private readonly NOTIFICATIONS_ENDPOINT = 'notifications';

  constructor(private httpClient: HttpClientService) {}

  async sendWelcomeEmail(user: User): Promise<void> {
    const emailPayload: EmailPayload = {
      to: user.getEmail().getValue(),
      subject: 'Welcome to MEF Platform!',
      body: `Welcome ${user.getName()}! Your account has been created successfully.`,
      template: 'welcome',
      templateData: {
        userName: user.getName(),
        userEmail: user.getEmail().getValue(),
        userId: user.getId().getValue(),
        platformUrl: window.location.origin
      }
    };

    try {
      await firstValueFrom(
        this.httpClient.post(`${this.NOTIFICATIONS_ENDPOINT}/email`, emailPayload)
      );
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw new Error(`Failed to send welcome email to ${user.getEmail().getValue()}`);
    }
  }

  async sendProductAvailableNotification(user: User, product: Product): Promise<void> {
    const emailPayload: EmailPayload = {
      to: user.getEmail().getValue(),
      subject: `${product.getName()} is now available!`,
      body: `Dear ${user.getName()}, ${product.getName()} is now available for purchase at ${product.getPrice().toFormattedString()}.`,
      template: 'product-available',
      templateData: {
        userName: user.getName(),
        productName: product.getName(),
        productDescription: product.getDescription(),
        productPrice: product.getPrice().toFormattedString(),
        productId: product.getId().getValue(),
        productUrl: `${window.location.origin}/products/${product.getId().getValue()}`
      }
    };

    try {
      await firstValueFrom(
        this.httpClient.post(`${this.NOTIFICATIONS_ENDPOINT}/email`, emailPayload)
      );
    } catch (error) {
      console.error('Failed to send product available notification:', error);
      throw new Error(`Failed to send product notification to ${user.getEmail().getValue()}`);
    }
  }

  async sendReservationConfirmation(user: User, product: Product, quantity: number): Promise<void> {
    const totalPrice = product.getPrice().multiply(quantity);
    
    const emailPayload: EmailPayload = {
      to: user.getEmail().getValue(),
      subject: `Reservation Confirmed: ${product.getName()}`,
      body: `Dear ${user.getName()}, your reservation for ${quantity} units of ${product.getName()} has been confirmed. Total: ${totalPrice.toFormattedString()}.`,
      template: 'reservation-confirmation',
      templateData: {
        userName: user.getName(),
        productName: product.getName(),
        productDescription: product.getDescription(),
        quantity,
        unitPrice: product.getPrice().toFormattedString(),
        totalPrice: totalPrice.toFormattedString(),
        reservationDate: new Date().toLocaleDateString(),
        reservationTime: new Date().toLocaleTimeString(),
        productId: product.getId().getValue()
      }
    };

    try {
      await firstValueFrom(
        this.httpClient.post(`${this.NOTIFICATIONS_ENDPOINT}/email`, emailPayload)
      );
    } catch (error) {
      console.error('Failed to send reservation confirmation:', error);
      throw new Error(`Failed to send reservation confirmation to ${user.getEmail().getValue()}`);
    }
  }

  async sendLowStockAlert(product: Product, currentStock: number, threshold: number): Promise<void> {
    const emailPayload: EmailPayload = {
      to: 'admin@mef-platform.com', // Lista de administradores
      subject: `LOW STOCK ALERT: ${product.getName()}`,
      body: `ALERT: ${product.getName()} has low stock. Current: ${currentStock}, Threshold: ${threshold}. Price: ${product.getPrice().toFormattedString()}`,
      template: 'low-stock-alert',
      templateData: {
        productName: product.getName(),
        productId: product.getId().getValue(),
        currentStock,
        threshold,
        stockStatus: currentStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
        severity: currentStock === 0 ? 'CRITICAL' : 'WARNING',
        productPrice: product.getPrice().toFormattedString(),
        alertDate: new Date().toLocaleDateString(),
        alertTime: new Date().toLocaleTimeString()
      }
    };

    try {
      await firstValueFrom(
        this.httpClient.post(`${this.NOTIFICATIONS_ENDPOINT}/email`, emailPayload)
      );
    } catch (error) {
      console.error('Failed to send low stock alert:', error);
      throw new Error(`Failed to send low stock alert for product ${product.getId().getValue()}`);
    }
  }

  async send(notification: NotificationData): Promise<void> {
    if (notification.type !== 'email') {
      throw new Error(`Email adapter does not support ${notification.type} notifications`);
    }

    const emailPayload: EmailPayload = {
      to: notification.recipient,
      subject: notification.subject,
      body: notification.content
    };

    try {
      await firstValueFrom(
        this.httpClient.post(`${this.NOTIFICATIONS_ENDPOINT}/email`, emailPayload)
      );
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw new Error(`Failed to send notification to ${notification.recipient}`);
    }
  }

  async sendSimple(recipient: string, subject: string, message: string, type: 'email' | 'sms' | 'push'): Promise<void> {
    if (type !== 'email') {
      throw new Error(`Email adapter does not support ${type} notifications`);
    }

    const emailPayload: EmailPayload = {
      to: recipient,
      subject,
      body: message
    };

    try {
      await firstValueFrom(
        this.httpClient.post(`${this.NOTIFICATIONS_ENDPOINT}/email`, emailPayload)
      );
    } catch (error) {
      console.error('Failed to send generic email:', error);
      throw new Error(`Failed to send email to ${recipient}`);
    }
  }
}