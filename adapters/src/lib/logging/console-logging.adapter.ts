import { Injectable } from '@angular/core';
import { LoggingPort } from '@mef-frontend-arquetipo/application';

/**
 * Implementación de logging para consola del navegador
 * Útil para desarrollo local
 */
@Injectable({
  providedIn: 'root'
})
export class ConsoleLoggingAdapter implements LoggingPort {
  private context = '';

  info(message: string, metadata?: Record<string, any>): void {
    const logMessage = this.formatMessage('INFO', message);
    console.info(logMessage, metadata || {});
  }

  warn(message: string, metadata?: Record<string, any>): void {
    const logMessage = this.formatMessage('WARN', message);
    console.warn(logMessage, metadata || {});
  }

  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    const logMessage = this.formatMessage('ERROR', message);
    console.error(logMessage, {
      error: error?.message,
      stack: error?.stack,
      ...metadata
    });
  }

  debug(message: string, metadata?: Record<string, any>): void {
    const logMessage = this.formatMessage('DEBUG', message);
    console.debug(logMessage, metadata || {});
  }

  withContext(context: string): LoggingPort {
    const newLogger = new ConsoleLoggingAdapter();
    newLogger.context = context;
    return newLogger;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    const contextPart = this.context ? `[${this.context}] ` : '';
    return `${timestamp} [${level}] ${contextPart}${message}`;
  }
}