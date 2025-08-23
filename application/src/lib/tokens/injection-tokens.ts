/**
 * Tokens de inyección para interfaces (puertos)
 * Angular no puede inyectar interfaces directamente, necesita tokens
 */

import { InjectionToken } from '@angular/core';
import { EventBusPort } from '../ports/event-bus.port';
import { NotificationPort } from '../ports/notification.port';
import { LoggingPort } from '../ports/logging.port';

// Tokens para puertos principales
export const EVENT_BUS_TOKEN = new InjectionToken<EventBusPort>('EventBusPort');
export const NOTIFICATION_TOKEN = new InjectionToken<NotificationPort>('NotificationPort');
export const LOGGING_TOKEN = new InjectionToken<LoggingPort>('LoggingPort');

// Para backward compatibility, también exportamos las interfaces originales
export type { EventBusPort as EventBusPortInterface } from '../ports/event-bus.port';
export type { NotificationPort as NotificationPortInterface } from '../ports/notification.port';
export type { LoggingPort as LoggingPortInterface } from '../ports/logging.port';