import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { 
  QueryClient
} from '@tanstack/angular-query-experimental';

// Shared Services
import {
  SimpleQueryService,
  UiStateService,
  NotificationService,
  NavigationStateService,
  FormStateService
} from '@mef-frontend-arquetipo/shared';

// Application Layer - Event Handlers and Ports
import {
  EventHandlerRegistryService,
  UserCreatedHandler,
  ProductReservedHandler,
  EVENT_BUS_TOKEN,
  NOTIFICATION_TOKEN,
  LOGGING_TOKEN
} from '@mef-frontend-arquetipo/application';

// Infrastructure Layer - Adapters
import {
  RxjsEventBusAdapter,
  ConsoleNotificationAdapter,
  ConsoleLoggingAdapter
} from '@mef-frontend-arquetipo/adapters';

import { routes } from './app.routes';

/**
 * Configuración de TanStack Query
 */
const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000, 
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
};

/**
 * Factory para crear QueryClient
 */
function queryClientFactory(): QueryClient {
  const queryClient = new QueryClient(queryClientConfig);
  return queryClient;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // 🚀 Angular Core
    provideRouter(routes),
    provideHttpClient(),

    // 📊 TanStack Query - Temporalmente comentado
    // provideAngularQuery(() => queryClientFactory()),

    // 🎨 SHARED LAYER - Services & Signals
    SimpleQueryService,
    UiStateService,
    NotificationService,
    NavigationStateService,
    FormStateService,

    // 🔧 INFRASTRUCTURE LAYER - Adapters
    { provide: EVENT_BUS_TOKEN, useClass: RxjsEventBusAdapter },
    { provide: NOTIFICATION_TOKEN, useClass: ConsoleNotificationAdapter },
    { provide: LOGGING_TOKEN, useClass: ConsoleLoggingAdapter },

    // 📡 APPLICATION LAYER - Event Handlers
    EventHandlerRegistryService,
    UserCreatedHandler,
    ProductReservedHandler,
  ],
};
