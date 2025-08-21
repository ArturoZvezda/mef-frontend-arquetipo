import { ApplicationConfig, importProvidersFrom, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { 
  provideAngularQuery, 
  QueryClient,
  QueryClientConfig 
} from '@tanstack/angular-query-experimental';

// Domain & Application Layer
import { 
  USER_REPOSITORY_TOKEN,
  PRODUCT_REPOSITORY_TOKEN,
  NOTIFICATION_SERVICE_TOKEN,
  LOGGER_SERVICE_TOKEN,
  EVENT_BUS_TOKEN,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  ReserveProductStockUseCase
} from '@mef-frontend-arquetipo/application';

// Infrastructure Layer
import { 
  HttpUserRepositoryAdapter,
  LocalStorageUserRepositoryAdapter,
  HttpProductRepositoryAdapter,
  LocalStorageProductRepositoryAdapter,
  ConsoleLoggerAdapter,
  ToastNotificationAdapter,
  RxjsEventBusAdapter
} from '@mef-frontend-arquetipo/adapters';

// Shared Services
import {
  SimpleQueryService,
  UiStateService,
  NotificationService,
  NavigationStateService,
  FormStateService
} from '@mef-frontend-arquetipo/shared';

import { routes } from './app.routes';

/**
 * Configuración de TanStack Query
 */
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Cache por 5 minutos por defecto
      staleTime: 5 * 60 * 1000,
      // Mantener en cache por 10 minutos
      gcTime: 10 * 60 * 1000, 
      // Reintentar 3 veces en caso de error
      retry: 3,
      // Refetch cuando la ventana toma foco
      refetchOnWindowFocus: true,
      // Refetch cuando se reconecta a internet
      refetchOnReconnect: true,
    },
    mutations: {
      // Reintentar mutations una vez
      retry: 1,
    },
  },
};

/**
 * Factory para crear QueryClient con configuración personalizada
 */
function queryClientFactory(): QueryClient {
  const queryClient = new QueryClient(queryClientConfig);
  
  // Event listeners para debugging en desarrollo
  if (!environment.production) {
    queryClient.getQueryCache().subscribe((event) => {
      console.log('[Query Cache Event]', event);
    });
    
    queryClient.getMutationCache().subscribe((event) => {
      console.log('[Mutation Cache Event]', event);
    });
  }
  
  return queryClient;
}

/**
 * Factory para repository - decide entre HTTP o LocalStorage
 */
function userRepositoryFactory() {
  // En un entorno real, esto se basaría en configuración
  const useLocalStorage = !environment.production || environment.offline;
  
  if (useLocalStorage) {
    return new LocalStorageUserRepositoryAdapter();
  } else {
    return new HttpUserRepositoryAdapter(inject(HttpClient));
  }
}

/**
 * Factory para product repository
 */
function productRepositoryFactory() {
  const useLocalStorage = !environment.production || environment.offline;
  
  if (useLocalStorage) {
    return new LocalStorageProductRepositoryAdapter();
  } else {
    return new HttpProductRepositoryAdapter(inject(HttpClient));
  }
}

/**
 * Configuración principal de la aplicación
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // 🚀 Angular Core
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        // Aquí iríán interceptors para auth, logging, etc.
      ])
    ),

    // 📊 TanStack Query
    provideAngularQuery(() => queryClientFactory()),

    // 🏗️ INFRASTRUCTURE LAYER - Adapters
    {
      provide: USER_REPOSITORY_TOKEN,
      useFactory: userRepositoryFactory,
      deps: []
    },
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useFactory: productRepositoryFactory,
      deps: []
    },
    {
      provide: LOGGER_SERVICE_TOKEN,
      useClass: ConsoleLoggerAdapter
    },
    {
      provide: NOTIFICATION_SERVICE_TOKEN,
      useClass: ToastNotificationAdapter
    },
    {
      provide: EVENT_BUS_TOKEN,
      useClass: RxjsEventBusAdapter
    },

    // 🎯 APPLICATION LAYER - Use Cases
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ReserveProductStockUseCase,

    // 🎨 SHARED LAYER - Services & Signals
    SimpleQueryService,
    UiStateService,
    NotificationService,
    NavigationStateService,
    FormStateService,

    // 🔧 APP INITIALIZATION
    {
      provide: 'APP_INITIALIZER',
      useFactory: (
        uiState: UiStateService
      ) => () => {
        // Inicializar servicios de UI
        uiState.initTheme();
        uiState.initMobileDetection();
        
        console.log('MEF Frontend Arquetipo - Application initialized');
        return Promise.resolve();
      },
      deps: [UiStateService],
      multi: true
    }
  ],
};

/**
 * Environment configuration
 * En un proyecto real, esto vendría de environment files
 */
const environment = {
  production: false,
  offline: false,
  apiUrl: 'http://localhost:3000/api',
  enableDevtools: true
};